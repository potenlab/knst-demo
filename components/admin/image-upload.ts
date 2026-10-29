/**
 * Browser-only image helpers for the admin: shrink big images before upload, upload with
 * progress, and talk to the media library API (`/api/admin/upload`).
 */

export const UPLOAD_URL = "/api/admin/upload";
export const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

/** Server limit is 1.5 MB; aim a little lower so multipart framing never tips it over. */
const TARGET_BYTES = 1_400_000;
const SERVER_MAX = 1_500_000;
const MAX_WIDTH = 1920;
const MIN_WIDTH = 480;

export type MediaItem = {
  id: string;
  filename: string;
  mime: string;
  size: number;
  width: number | null;
  height: number | null;
  created_at: string;
  url?: string;
};

export type Uploaded = { id: string; url: string; mime: string; size: number; width: number | null; height: number | null };

export const mediaUrl = (m: { id: string; url?: string }) => m.url || `/media/${m.id}`;

export function formatBytes(bytes: number) {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)}MB`;
  return `${Math.max(1, Math.round(bytes / 1000))}KB`;
}

/** Error whose message is ready to show to the editor (Korean, says what to do). */
export class UploadError extends Error {
  constructor(message: string, readonly authExpired = false) {
    super(message);
  }
}

export type Prepared = { blob: Blob; filename: string; width: number; height: number; resized: boolean; originalSize: number };

/* ───────────────────────── decode / encode ───────────────────────── */

async function decode(file: Blob): Promise<{ source: CanvasImageSource; width: number; height: number; close(): void }> {
  if (typeof createImageBitmap === "function") {
    try {
      const bmp = await createImageBitmap(file);
      return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
    } catch {
      /* fall through to <img> */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => URL.revokeObjectURL(url) };
  } catch {
    URL.revokeObjectURL(url);
    throw new UploadError("이미지를 읽을 수 없습니다. 파일이 손상됐을 수 있습니다. 이미지 편집 앱에서 PNG나 JPG로 다시 저장해 올려 주세요.");
  }
}

function encode(source: CanvasImageSource, w: number, h: number, type: string, quality?: number, background?: string) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new UploadError("이 브라우저에서는 이미지를 줄일 수 없습니다. 가로 1920px 이하, 1.4MB 이하로 줄인 뒤 다시 올려 주세요.");
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, w, h);
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new UploadError("이미지를 줄이지 못했습니다. 가로 1920px 이하로 줄여 다시 올려 주세요."))), type, quality),
  );
}

const extFor = (mime: string) => (mime === "image/jpeg" ? "jpg" : mime.split("/")[1] ?? "png");
const renameExt = (name: string, mime: string) => `${name.replace(/\.[a-z0-9]{2,5}$/i, "") || "image"}.${extFor(mime)}`;

/**
 * Validates the file type and, when it is over ~1.4 MB or wider than 1920px, scales it down
 * and re-encodes it in the browser (PNG stays PNG; JPEG/WebP at quality ≈0.85).
 */
export async function prepareImage(file: File): Promise<Prepared> {
  const type = (file.type || "").toLowerCase().replace("image/jpg", "image/jpeg");
  if (/heic|heif/.test(type) || /\.(heic|heif)$/i.test(file.name)) {
    throw new UploadError("아이폰 HEIC 사진은 올릴 수 없습니다. 사진 앱에서 JPG로 내보내거나, 설정 › 카메라 › 포맷을 ‘높은 호환성’으로 바꾼 뒤 다시 올려 주세요.");
  }
  if (!ALLOWED.includes(type)) {
    throw new UploadError(`PNG, JPG, WebP, GIF 이미지만 올릴 수 있습니다. (${file.type || "알 수 없는 형식"}) 이미지 편집 앱에서 PNG나 JPG로 저장해 다시 올려 주세요.`);
  }
  if (file.size === 0) throw new UploadError("빈 파일입니다. 다른 이미지를 골라 주세요.");

  const img = await decode(file);
  try {
    const { width, height } = img;
    if (file.size <= TARGET_BYTES && width <= MAX_WIDTH) {
      return { blob: file, filename: file.name, width, height, resized: false, originalSize: file.size };
    }

    if (type === "image/gif") {
      // re-encoding would drop the animation — send it as is if the server will take it
      if (file.size <= SERVER_MAX) return { blob: file, filename: file.name, width, height, resized: false, originalSize: file.size };
      throw new UploadError(
        `GIF가 ${formatBytes(file.size)}라 1.5MB를 넘습니다. 움직이는 GIF는 브라우저에서 줄일 수 없습니다. 크기나 프레임 수를 줄이거나 JPG·PNG로 저장해 다시 올려 주세요.`,
      );
    }

    let outType = type; // png → png, jpeg → jpeg, webp → webp (falls back to png if the browser can't encode webp)
    let quality = outType === "image/png" ? undefined : 0.85;
    let w = Math.min(width, MAX_WIDTH);
    let h = Math.max(1, Math.round((height * w) / width));
    let blob: Blob | null = null;

    for (let step = 0; step < 12; step++) {
      blob = await encode(img.source, w, h, outType, quality, outType === "image/jpeg" ? "#ffffff" : undefined);
      if (blob.type && blob.type !== outType) {
        outType = blob.type; // e.g. Safari without WebP encoding → PNG
        quality = outType === "image/png" ? undefined : quality;
      }
      if (blob.size <= TARGET_BYTES) break;
      if (outType !== "image/png" && quality !== undefined && quality > 0.66) {
        quality = Math.round((quality - 0.1) * 100) / 100;
        continue;
      }
      const nextW = Math.round(w * (outType === "image/png" ? 0.8 : 0.85));
      if (nextW < MIN_WIDTH) break;
      w = nextW;
      h = Math.max(1, Math.round((height * w) / width));
    }

    if (!blob || blob.size > SERVER_MAX) {
      throw new UploadError(
        `이미지를 충분히 줄이지 못했습니다(${formatBytes(blob?.size ?? file.size)}). 사진이라면 JPG로 저장하고, 가로 1920px 이하·1.5MB 이하로 줄여 다시 올려 주세요.`,
      );
    }
    return { blob, filename: renameExt(file.name, outType), width: w, height: h, resized: true, originalSize: file.size };
  } finally {
    img.close();
  }
}

/* ───────────────────────── API ───────────────────────── */

function statusMessage(status: number) {
  if (status === 401) return "로그인이 만료되었습니다. 새 탭에서 다시 로그인한 뒤 다시 올려 주세요. 쓰던 글은 이 화면에 그대로 있습니다.";
  if (status === 413) return "이미지가 1.5MB를 넘습니다. 가로 1920px 이하로 줄여 다시 올려 주세요.";
  if (status === 415) return "PNG, JPG, WebP, GIF 이미지만 올릴 수 있습니다. 다른 형식은 PNG나 JPG로 저장해 다시 올려 주세요.";
  if (status === 404) return "이미지 올리기 기능을 찾지 못했습니다. 잠시 뒤 다시 시도하고, 계속되면 관리자에게 알려 주세요.";
  if (status === 0) return "네트워크 문제로 올리지 못했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.";
  return "이미지를 올리지 못했습니다. 잠시 뒤 다시 시도해 주세요. 계속되면 관리자에게 알려 주세요.";
}

function parseJson(text: string): Record<string, unknown> | null {
  try {
    const v = JSON.parse(text);
    return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** POST one image (multipart `file` + width/height). Rejects with an UploadError. */
export function uploadImage(p: Prepared, onProgress?: (fraction: number) => void, signal?: AbortSignal): Promise<Uploaded> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", p.blob, p.filename);
    fd.append("width", String(p.width));
    fd.append("height", String(p.height));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", UPLOAD_URL);
    xhr.responseType = "text";
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.min(0.99, e.loaded / e.total));
    };
    xhr.onload = () => {
      const body = parseJson(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300 && body?.ok === true && typeof body.id === "string") {
        onProgress?.(1);
        resolve({
          id: body.id,
          url: typeof body.url === "string" ? body.url : `/media/${body.id}`,
          mime: String(body.mime ?? p.blob.type),
          size: Number(body.size ?? p.blob.size),
          width: Number(body.width) || p.width || null,
          height: Number(body.height) || p.height || null,
        });
        return;
      }
      const msg = typeof body?.error === "string" && body.error ? body.error : statusMessage(xhr.status);
      reject(new UploadError(xhr.status === 413 ? statusMessage(413) : msg, xhr.status === 401));
    };
    xhr.onerror = () => reject(new UploadError(statusMessage(0)));
    xhr.onabort = () => reject(new UploadError("업로드를 취소했습니다."));
    signal?.addEventListener("abort", () => xhr.abort(), { once: true });
    xhr.send(fd);
  });
}

export async function fetchMedia(): Promise<MediaItem[]> {
  let res: Response;
  try {
    res = await fetch(`${UPLOAD_URL}?limit=200`, { cache: "no-store", headers: { Accept: "application/json" } });
  } catch {
    throw new UploadError("네트워크 문제로 보관함을 불러오지 못했습니다. 연결을 확인하고 ‘다시 불러오기’를 눌러 주세요.");
  }
  const body = parseJson(await res.text());
  if (!res.ok || !body || !Array.isArray(body.items)) {
    if (res.status === 401) throw new UploadError("로그인이 만료되어 보관함을 열 수 없습니다. 새 탭에서 다시 로그인해 주세요.", true);
    throw new UploadError(typeof body?.error === "string" ? body.error : "보관함을 불러오지 못했습니다. 잠시 뒤 ‘다시 불러오기’를 눌러 주세요.");
  }
  return body.items as MediaItem[];
}

export type DeleteResult =
  | { ok: true }
  | { ok: false; error: string; usedBy?: { id: number; title: string; status: string }[] };

export async function deleteMediaItem(id: string, force = false): Promise<DeleteResult> {
  let res: Response;
  try {
    res = await fetch(`${UPLOAD_URL}?id=${encodeURIComponent(id)}${force ? "&force=1" : ""}`, { method: "DELETE" });
  } catch {
    return { ok: false, error: "네트워크 문제로 삭제하지 못했습니다. 연결을 확인하고 다시 시도해 주세요." };
  }
  const body = parseJson(await res.text());
  if (res.ok && body?.ok !== false) return { ok: true };
  return {
    ok: false,
    error: typeof body?.error === "string" ? body.error : res.status === 401 ? statusMessage(401) : "삭제하지 못했습니다. 잠시 뒤 다시 시도해 주세요.",
    usedBy: Array.isArray(body?.usedBy) ? (body.usedBy as { id: number; title: string; status: string }[]) : undefined,
  };
}

/** Image files from a drop/paste, plus the names of anything that isn't an image. */
export function pickImageFiles(list: FileList | File[] | null | undefined) {
  const files = Array.from(list ?? []);
  return {
    images: files.filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name)),
    others: files.filter((f) => !(f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name))),
  };
}
