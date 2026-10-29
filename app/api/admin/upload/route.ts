import { isAdmin } from "@/lib/auth";
import { deleteMedia, listMedia, MEDIA_MAX_BYTES, MEDIA_MIME, mediaUsage, saveMedia } from "@/lib/db";

/**
 * Admin image uploads (stored in D1, served by /media/<id>).
 *
 *   POST   multipart/form-data  file=<File> [width=<n>] [height=<n>]
 *          → 200 { ok:true, id, url:"/media/<id>", mime, size, width, height, filename }
 *   GET    [?limit=1..200]      → 200 { ok:true, items: (MediaRow & { url })[] }
 *   DELETE ?id=<id>[&force=1]   → 200 { ok:true, id } · 409 when a post still uses it (pass force=1 to delete anyway)
 *
 * Errors are always { ok:false, error:"<Korean message>" } with a matching HTTP status.
 * POST/DELETE must be same-origin (Origin host === request host).
 */
export const dynamic = "force-dynamic";

type Mime = (typeof MEDIA_MIME)[number];

const MAX_MB = (MEDIA_MAX_BYTES / 1_000_000).toFixed(1);
const ID_RE = /^[\w-]{8,32}\.(png|jpg|webp|gif)$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
const fail = (status: number, error: string, extra: Record<string, unknown> = {}) => json({ ok: false, error, ...extra }, status);

const UNAUTHORIZED = () => fail(401, "로그인이 필요합니다. 관리자 페이지에서 다시 로그인해 주세요.");

/** Blocks cross-site POST/DELETE: the Origin header must name this very host. */
function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin || origin === "null") return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const o = originHost.toLowerCase();
  return o === new URL(req.url).host.toLowerCase() || o === (req.headers.get("host") ?? "").toLowerCase();
}

/** What the bytes actually are, from their signature. */
function sniffMime(b: Uint8Array): Mime | null {
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a)
    return "image/png";
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length >= 12 && ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 4) === "WEBP") return "image/webp";
  if (b.length >= 6 && (ascii(b, 0, 6) === "GIF87a" || ascii(b, 0, 6) === "GIF89a")) return "image/gif";
  return null;
}

const ascii = (b: Uint8Array, at: number, len: number) => String.fromCharCode(...b.subarray(at, at + len));

/** Pixel size from the file header, so width/height don't depend on the client. Null when unknown. */
function sniffSize(b: Uint8Array, mime: Mime): { width: number; height: number } | null {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  try {
    if (mime === "image/png" && b.length >= 24 && ascii(b, 12, 4) === "IHDR") return { width: dv.getUint32(16), height: dv.getUint32(20) };
    if (mime === "image/gif" && b.length >= 10) return { width: dv.getUint16(6, true), height: dv.getUint16(8, true) };
    if (mime === "image/webp" && b.length >= 30) {
      const chunk = ascii(b, 12, 4);
      if (chunk === "VP8X") return { width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)), height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)) };
      if (chunk === "VP8L" && b[20] === 0x2f) {
        const bits = dv.getUint32(21, true);
        return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
      }
      if (chunk === "VP8 " && b[23] === 0x9d && b[24] === 0x01 && b[25] === 0x2a)
        return { width: dv.getUint16(26, true) & 0x3fff, height: dv.getUint16(28, true) & 0x3fff };
    }
    if (mime === "image/jpeg") {
      let i = 2;
      while (i + 9 < b.length) {
        if (b[i] !== 0xff) return null;
        const marker = b[i + 1];
        if (marker === 0xff) {
          i++;
          continue;
        }
        const len = dv.getUint16(i + 2);
        // SOF0..SOF15 except DHT(C4), JPG(C8), DAC(CC)
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc)
          return { width: dv.getUint16(i + 7), height: dv.getUint16(i + 5) };
        i += 2 + len;
      }
    }
  } catch {
    // truncated / malformed header
  }
  return null;
}

/** Optional client-provided dimension: a positive integer up to 20000, else null. */
function dim(v: FormDataEntryValue | null) {
  if (typeof v !== "string" || !/^\d{1,5}$/.test(v.trim())) return null;
  const n = Number(v);
  return n >= 1 && n <= 20000 ? n : null;
}

/** Display name only (never used as a path): basename, no control/markup chars, ≤120 chars. */
function cleanFilename(name: string, mime: Mime) {
  const base = (name.split(/[\\/]/).pop() ?? "")
    .normalize("NFC")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f<>:"'`|?*]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\.+/, "");
  const fallback = `image.${mime === "image/jpeg" ? "jpg" : mime.split("/")[1]}`;
  return (base || fallback).slice(0, 120);
}

const normalizeDeclared = (t: string) => {
  const v = t.trim().toLowerCase();
  return v === "image/jpg" || v === "image/pjpeg" ? "image/jpeg" : v;
};

const tooBig = (bytes?: number) =>
  fail(
    413,
    `이미지가 너무 큽니다${bytes ? ` (${(bytes / 1_000_000).toFixed(2)}MB)` : ""}. 최대 ${MAX_MB}MB까지 올릴 수 있어요. 가로 2000px 이하로 줄이거나 JPG/WebP로 압축한 뒤 다시 올려 주세요.`,
  );

export async function POST(req: Request) {
  if (!(await isAdmin())) return UNAUTHORIZED();
  if (!sameOrigin(req)) return fail(403, "허용되지 않은 요청입니다. 관리자 페이지에서 직접 올려 주세요.");

  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("multipart/form-data"))
    return fail(400, "이미지 파일을 multipart/form-data 형식으로 보내 주세요.");

  // reject obviously oversized bodies before buffering them (64KB slack for multipart framing + fields)
  const declaredLen = Number(req.headers.get("content-length") ?? "0");
  if (declaredLen > MEDIA_MAX_BYTES + 64 * 1024) return tooBig(declaredLen);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail(400, "업로드 요청을 읽을 수 없습니다. 다시 시도해 주세요.");
  }

  const file = form.get("file");
  if (!file || typeof file === "string") return fail(400, "이미지 파일이 없습니다. 파일을 선택해 주세요.");
  if (file.size === 0) return fail(400, "빈 파일입니다. 다른 이미지를 선택해 주세요.");
  if (file.size > MEDIA_MAX_BYTES) return tooBig(file.size);

  const declared = normalizeDeclared(file.type);
  if (!(MEDIA_MIME as readonly string[]).includes(declared))
    return fail(415, "PNG, JPG, WebP, GIF 이미지만 올릴 수 있습니다. (SVG·HEIC 등은 지원하지 않아요)");

  const data = await file.arrayBuffer();
  const bytes = new Uint8Array(data);
  const actual = sniffMime(bytes);
  if (!actual) return fail(415, "이미지 파일이 아니거나 손상된 파일입니다. PNG, JPG, WebP, GIF만 올릴 수 있어요.");
  if (actual !== declared) return fail(415, "파일 확장자(형식)와 실제 내용이 다릅니다. 원본 이미지를 다시 저장해서 올려 주세요.");

  const sniffed = sniffSize(bytes, actual);
  const width = sniffed?.width || dim(form.get("width"));
  const height = sniffed?.height || dim(form.get("height"));
  const filename = cleanFilename(file.name ?? "", actual);

  let id: string;
  try {
    id = await saveMedia({ filename, mime: actual, data, width, height });
  } catch {
    return fail(500, "이미지를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }

  return json({ ok: true, id, url: `/media/${id}`, mime: actual, size: data.byteLength, width, height, filename });
}

export async function GET(req: Request) {
  if (!(await isAdmin())) return UNAUTHORIZED();
  const raw = Number(new URL(req.url).searchParams.get("limit") ?? "60");
  const limit = Number.isInteger(raw) && raw >= 1 && raw <= 200 ? raw : 60;
  const items = (await listMedia(limit)).map((m) => ({ ...m, url: `/media/${m.id}` }));
  return json({ ok: true, items });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return UNAUTHORIZED();
  if (!sameOrigin(req)) return fail(403, "허용되지 않은 요청입니다. 관리자 페이지에서 직접 삭제해 주세요.");

  const params = new URL(req.url).searchParams;
  const id = params.get("id") ?? "";
  if (!ID_RE.test(id)) return fail(400, "잘못된 이미지 ID입니다.");

  if (params.get("force") !== "1") {
    const usedBy = await mediaUsage(id);
    if (usedBy.length)
      return fail(409, `이 이미지는 글 ${usedBy.length}개에서 쓰이고 있습니다. 글에서 먼저 빼거나, 그래도 지우려면 강제 삭제해 주세요.`, { usedBy });
  }

  const deleted = await deleteMedia(id);
  if (!deleted) return fail(404, "이미 삭제되었거나 없는 이미지입니다.");
  return json({ ok: true, id });
}
