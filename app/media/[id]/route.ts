import { getMedia, getMediaMeta, MEDIA_MIME } from "@/lib/db";

/**
 * GET /media/<id> — serves an uploaded image straight out of D1.
 * Ids are random + immutable (a re-upload gets a new id), so responses cache forever.
 * Only raster types from MEDIA_MIME are ever served — never SVG/HTML, whatever the row says.
 */
export const dynamic = "force-dynamic";

const ID_RE = /^[\w-]{8,32}\.(png|jpg|webp|gif)$/;
const EXT_MIME: Record<string, string> = { png: "image/png", jpg: "image/jpeg", webp: "image/webp", gif: "image/gif" };

const notFound = () =>
  new Response("Not found", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });

/** D1 hands BLOBs back as ArrayBuffer, Uint8Array or a plain number[] depending on runtime/version. */
function toBytes(data: unknown): Uint8Array<ArrayBuffer> | null {
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer as ArrayBuffer, data.byteOffset, data.byteLength);
  if (Array.isArray(data)) return Uint8Array.from(data as number[]);
  return null;
}

// vinext passes dynamic params still percent-encoded
const decode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return "";
  }
};

async function serve(req: Request, params: Promise<{ id: string }>, head: boolean) {
  const id = decode((await params).id ?? "");
  const m = ID_RE.exec(id);
  if (!m) return notFound();

  const etag = `"${id}"`;
  const baseHeaders = {
    ETag: etag,
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
    // an image response must never be able to act as a document
    "Content-Security-Policy": "default-src 'none'; sandbox",
    "Cross-Origin-Resource-Policy": "same-site",
  };

  // ids are content-immutable: a matching ETag means the client already has these exact bytes
  const inm = req.headers.get("if-none-match");
  if (inm && inm.split(",").some((t) => t.trim().replace(/^W\//, "") === etag || t.trim() === "*")) {
    // still confirm the file exists, so a deleted image doesn't live on via 304s
    const meta = await getMediaMeta(id).catch(() => null);
    if (!meta) return notFound();
    return new Response(null, { status: 304, headers: baseHeaders });
  }

  const row = await getMedia(id).catch(() => null);
  if (!row) return notFound();

  // the stored type must be an allowed raster type AND agree with the id's extension
  const mime = row.mime;
  if (!(MEDIA_MIME as readonly string[]).includes(mime) || EXT_MIME[m[1]] !== mime) return notFound();

  const bytes = toBytes(row.data);
  if (!bytes) return notFound();

  return new Response(head ? null : bytes, {
    status: 200,
    headers: { ...baseHeaders, "Content-Type": mime, "Content-Length": String(bytes.byteLength) },
  });
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return serve(req, params, false);
}

export async function HEAD(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return serve(req, params, true);
}
