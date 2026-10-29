import { env } from "cloudflare:workers";
import { cookies } from "next/headers";

const COOKIE = "nst_admin";
const MAX_AGE = 60 * 60 * 12; // 12h

const enc = new TextEncoder();

async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(env.SESSION_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** Constant-time-ish password check against the ADMIN_PASSWORD secret. */
export async function checkPassword(input: string) {
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) return false;
  const [a, b] = await Promise.all([hmac(`pw:${input}`), hmac(`pw:${env.ADMIN_PASSWORD}`)]);
  return safeEqual(a, b);
}

/** Call from a server action after checkPassword() succeeds. */
export async function startSession() {
  const exp = Date.now() + MAX_AGE * 1000;
  const token = `${exp}.${await hmac(`sess:${exp}`)}`;
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: MAX_AGE });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

/** True when the request carries a valid, unexpired admin session cookie. */
export async function isAdmin() {
  if (!env.SESSION_SECRET) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(`sess:${exp}`));
}

/** Use at the top of every admin server action / admin page. Throws when not signed in. */
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("UNAUTHORIZED");
}
