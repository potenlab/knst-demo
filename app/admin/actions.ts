"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, endSession, requireAdmin, startSession } from "@/lib/auth";
import { createPost, deletePost, getById, setStatus, slugExists, slugify, updatePost, type PostStatus } from "@/lib/db";
import { CATEGORY_SECTION, DEFAULT_CATEGORY, postPathFor, toCategory } from "@/lib/post-categories";
import { sanitizePostHtml } from "@/lib/sanitize";
import { refreshPublicPages } from "@/worker/page-cache";
import {
  LIMITS,
  SAVE_MESSAGES,
  countMissingAlt,
  hasBody,
  normalizeSlug,
  slugError,
  suggestExcerpt,
  validatePost,
  type FieldErrors,
  type PostFields,
  type SaveIntent,
} from "@/components/admin/post-rules";

/* ───────────────────────── helpers ───────────────────────── */

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function parseId(v: unknown): number | null {
  const id = typeof v === "number" ? v : Number.parseInt(String(v ?? ""), 10);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/** Every public section a post can live in (blog = 칼럼·가이드, 공지사항, 언론동향). */
const SECTION_ROOTS = [...new Set(Object.values(CATEGORY_SECTION))].map((p) => p.replace(/\/$/, "")); // "/blog", "/notices", "/news"

/**
 * Refresh every public surface a post can appear on, plus the admin list. A slug is refreshed under
 * every section, so a post whose category changed is dropped from its old section too.
 */
function revalidatePublic(...slugs: (string | null | undefined)[]) {
  const paths = new Set<string>(["/", "/blog/rss.xml", "/sitemap.xml", "/admin", ...SECTION_ROOTS]);
  for (const s of slugs) {
    if (!s) continue;
    for (const root of SECTION_ROOTS) {
      paths.add(`${root}/${s}`);
      paths.add(`${root}/${encodeURIComponent(s)}`); // Hangul slugs: cover both cache-key spellings
    }
  }
  for (const p of paths) revalidatePath(p);
  for (const root of SECTION_ROOTS) revalidatePath(root, "layout"); // list pages, tabs, every post
}

const isUniqueViolation = (e: unknown) => e instanceof Error && /UNIQUE/i.test(e.message);

/* ───────────────────────── auth ───────────────────────── */

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = str(formData.get("password"));
  const ok = password.length > 0 && password.length <= 256 && (await checkPassword(password));
  if (!ok) {
    // Same message and a fixed delay for every failure — slows guessing, reveals nothing.
    await sleep(800);
    return { error: "비밀번호가 맞지 않습니다. 대소문자와 한/영 전환을 확인한 뒤 다시 입력해 주세요." };
  }
  await startSession();
  redirect("/admin/");
}

/** Clearing the session cookie is harmless for anyone, so it does not require a valid session. */
export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login/");
}

/* ───────────────────────── editor ───────────────────────── */

export type SaveState = {
  ok: boolean;
  message: string;
  errors?: FieldErrors;
  status?: PostStatus;
  /** Bumps on every response so the client can react to identical consecutive results. */
  at?: number;
  authExpired?: boolean;
  /** Body exactly as stored (sanitized). The editor adopts it when the sanitizer removed something. */
  html?: string;
  /** Saved with an empty excerpt → a suggestion from the body text (shown to the editor, used only if they accept it). */
  excerptSuggestion?: string;
};

const INTENTS: SaveIntent[] = ["draft", "publish", "update", "unpublish"];

/** Hard cap on the raw body before sanitizing (the stored limit is checked after sanitizing). */
const RAW_BODY_MAX = LIMITS.content * 3;

const AUTH_EXPIRED: Omit<SaveState, "at"> = {
  ok: false,
  authExpired: true,
  message: "로그인이 만료되어 저장하지 못했습니다. 새 탭에서 다시 로그인한 뒤 같은 버튼을 다시 눌러 주세요. 쓰던 내용은 이 화면에 그대로 있습니다.",
};

/** requireAdmin() as a boolean, so editor actions can answer with a message instead of throwing away the editor's work. */
async function signedIn() {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}

export async function savePostAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  const at = Date.now();
  if (!(await signedIn())) return { ...AUTH_EXPIRED, at };

  const intentRaw = str(formData.get("intent"));
  const intent: SaveIntent = (INTENTS as string[]).includes(intentRaw) ? (intentRaw as SaveIntent) : "draft";

  const idRaw = str(formData.get("id"));
  const id = idRaw ? parseId(idRaw) : null;
  if (idRaw && !id) return { ok: false, at, message: "잘못된 요청입니다. 목록에서 글을 다시 열어 주세요." };

  const prev = id ? await getById(id) : null;
  if (id && !prev) {
    return { ok: false, at, message: "이 글을 찾을 수 없습니다. 다른 곳에서 삭제됐을 수 있습니다. 본문을 복사해 둔 뒤 목록을 확인해 주세요." };
  }

  const status: PostStatus =
    intent === "publish" ? "published" : intent === "update" ? (prev?.status ?? "draft") : "draft";

  const rawHtml = str(formData.get("content_html"));
  if (rawHtml.length > RAW_BODY_MAX) {
    return {
      ok: false,
      at,
      errors: { content_html: `본문이 너무 깁니다. HTML 기준 ${LIMITS.content.toLocaleString("ko-KR")}자 이내여야 합니다. 글을 둘로 나눠 올려 주세요.` },
      message: "저장하지 못했습니다. 아래에 표시된 항목을 고친 뒤 다시 눌러 주세요.",
    };
  }

  const raw: PostFields = {
    title: str(formData.get("title")),
    slug: str(formData.get("slug")),
    excerpt: str(formData.get("excerpt")),
    category: str(formData.get("category")),
    cover_image: str(formData.get("cover_image")),
    source_url: str(formData.get("source_url")),
    // allow-list sanitize first: limits and checks below run on exactly what gets stored
    content_html: sanitizePostHtml(rawHtml),
  };
  if (!raw.slug.trim()) raw.slug = slugify(raw.title);

  const { values, errors } = validatePost(raw, { publishing: status === "published" });
  if (!errors.slug && (await slugExists(values.slug, id ?? undefined))) {
    errors.slug = "이미 다른 글이 쓰고 있는 주소입니다. 끝에 -2 처럼 구분되는 말을 붙여 주세요.";
  }
  if (Object.keys(errors).length) {
    return { ok: false, at, errors, message: "저장하지 못했습니다. 아래에 표시된 항목을 고친 뒤 다시 눌러 주세요." };
  }

  const input = {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt,
    category: toCategory(values.category) ?? DEFAULT_CATEGORY, // validatePost already rejected anything else
    cover_image: values.cover_image || null,
    source_url: values.source_url || null,
    content_html: values.content_html,
    // legacy markdown is never rewritten by the HTML editor
    content_md: prev?.content_md ?? "",
    status,
  };

  let newId: number | null = null;
  try {
    if (id) await updatePost(id, input);
    else newId = await createPost(input);
  } catch (e) {
    if (isUniqueViolation(e)) {
      return { ok: false, at, errors: { slug: "방금 다른 글이 이 주소를 가져갔습니다. 주소를 조금 바꿔 다시 저장해 주세요." }, message: "저장하지 못했습니다. 주소를 바꿔 주세요." };
    }
    console.error("[admin] save failed", e instanceof Error ? e.message : "unknown error");
    return { ok: false, at, message: "저장 중 문제가 생겼습니다. 잠시 뒤 다시 눌러 주세요. 계속되면 본문을 복사해 두고 관리자에게 알려 주세요." };
  }

  revalidatePublic(prev?.slug, values.slug);
  // public page cache (worker/page-cache.ts): only when a published post changed or appeared
  if (status === "published" || prev?.status === "published") await refreshPublicPages([postPathFor(input.category, values.slug)]);
  if (id) revalidatePath(`/admin/${id}`);

  if (newId) redirect(`/admin/${newId}/?saved=${intent === "publish" ? "publish" : "draft"}`);

  const excerptSuggestion = values.excerpt ? undefined : suggestExcerpt(values.content_html) || undefined;
  return { ok: true, at, status, message: SAVE_MESSAGES[intent], html: values.content_html, excerptSuggestion };
}

export type SlugCheck = { ok: boolean; message: string };

/** Live uniqueness/format check for the slug field (the save action re-checks). */
export async function checkSlugAction(slugInput: string, exceptId: number | null): Promise<SlugCheck> {
  if (!(await signedIn())) return { ok: false, message: "로그인이 만료되었습니다. 새 탭에서 다시 로그인해 주세요." };
  const slug = normalizeSlug(String(slugInput ?? "")).slice(0, 200);
  const fmt = slugError(slug);
  if (fmt) return { ok: false, message: fmt };
  const except = exceptId == null ? undefined : (parseId(exceptId) ?? undefined);
  if (await slugExists(slug, except)) {
    return { ok: false, message: "이미 다른 글이 쓰고 있는 주소입니다. 끝에 -2 처럼 구분되는 말을 붙여 주세요." };
  }
  return { ok: true, message: "쓸 수 있는 주소입니다." };
}

/* ───────────────────────── list quick actions ───────────────────────── */

export async function setStatusAction(idArg: number, statusArg: PostStatus, _form?: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(idArg);
  const status: PostStatus | null = statusArg === "published" || statusArg === "draft" ? statusArg : null;
  if (!id || !status) redirect("/admin/?notice=invalid");

  const prev = await getById(id);
  if (!prev) redirect("/admin/?notice=missing");
  if (status === "published") {
    // legacy rows without HTML still render their markdown publicly
    const body = prev.content_html.trim() ? hasBody(prev.content_html) : !!prev.content_md.trim();
    if (!body || !prev.title.trim()) redirect("/admin/?notice=empty");
    if (countMissingAlt(prev.content_html)) redirect("/admin/?notice=alt");
  }

  await setStatus(id, status);
  revalidatePublic(prev.slug);
  await refreshPublicPages([postPathFor(prev.category, prev.slug)]);
  redirect(`/admin/?notice=${status === "published" ? "published" : "unpublished"}`);
}

export async function deletePostAction(idArg: number, _form?: FormData): Promise<void> {
  await requireAdmin();
  const id = parseId(idArg);
  if (!id) redirect("/admin/?notice=invalid");

  const prev = await getById(id);
  if (!prev) redirect("/admin/?notice=missing");

  await deletePost(id);
  revalidatePublic(prev.slug);
  if (prev.status === "published") await refreshPublicPages();
  redirect("/admin/?notice=deleted");
}
