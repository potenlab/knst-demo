"use client";

import { startTransition, useActionState, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CircleAlert, CircleCheck, LoaderCircle, RefreshCw, Save, Send, Sparkles, Undo2 } from "lucide-react";
import { checkSlugAction, savePostAction, type SaveState, type SlugCheck } from "@/app/admin/actions";
import type { PostStatus } from "@/lib/db";
import { CATEGORY_LABEL, CATEGORY_SECTION, POST_CATEGORIES, toCategory } from "@/lib/post-categories";
import { sanitizePostHtml } from "@/lib/sanitize";
import {
  DEFAULT_CATEGORY,
  LIMITS,
  SAVE_MESSAGES,
  countMissingAlt,
  firstError,
  normalizeSlug,
  slugError,
  slugifyClient,
  suggestExcerpt,
  validatePost,
  type FieldErrors,
  type FieldName,
  type PostFields,
  type SaveIntent,
} from "./post-rules";
import BodyEditor, { type BodyEditorHandle } from "./BodyEditor";
import CoverPicker from "./CoverPicker";
import StatusBadge from "./StatusBadge";
import { normHtml, removedParts } from "./html-tools";
import { formatKst, postHref } from "./format";
import { btn, card, field } from "./styles";

export type EditorPost = { id: number; status: PostStatus; slug: string; published_at: string | null; updated_at: string };

type Props = {
  post: EditorPost | null;
  initial: PostFields;
  /** Set after creating a post (the create action redirects here with ?saved=…). */
  flash?: SaveIntent;
  /** Body was converted from legacy markdown on the server for this session. */
  legacyConverted?: boolean;
};

type Notice = { tone: "ok" | "error"; text: string; authExpired?: boolean } | null;

const LEAVE_MSG = "저장하지 않은 변경사항이 있습니다. 이 페이지를 떠나면 사라집니다. 그래도 떠날까요?";
/** Carries the "what the sanitizer removed" report across the redirect after creating a post. */
const REPORT_KEY = "nst-admin:stripped";
const FIELDS: FieldName[] = ["title", "slug", "excerpt", "category", "cover_image", "source_url", "content_html"];
const fid = (f: FieldName) => `f-${f}`;
const eid = (f: FieldName) => `e-${f}`;

const same = (a: PostFields, b: PostFields) =>
  FIELDS.every((k) => (k === "content_html" ? normHtml(a[k]) === normHtml(b[k]) : a[k] === b[k]));

export default function PostEditor({ post, initial, flash, legacyConverted = false }: Props) {
  const [values, setValues] = useState<PostFields>(initial);
  const [saved, setSaved] = useState<PostFields>(initial);
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");
  const [savedSlug, setSavedSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!post); // never auto-change the URL of an existing post
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<Notice>(flash ? { tone: "ok", text: SAVE_MESSAGES[flash] } : null);
  const [intent, setIntent] = useState<SaveIntent | null>(null);
  const [slugCheck, setSlugCheck] = useState<(SlugCheck & { slug: string }) | null>(null);
  const [uploading, setUploading] = useState(0);
  const [legacyNote, setLegacyNote] = useState(legacyConverted);

  const [state, dispatch, pending] = useActionState<SaveState, FormData>(savePostAction, { ok: true, message: "" });

  const formRef = useRef<HTMLFormElement>(null);
  const bodyRef = useRef<BodyEditorHandle>(null);
  const primarySaveRef = useRef<HTMLButtonElement>(null);
  const submittedRef = useRef<PostFields | null>(null);
  const removedRef = useRef<string[]>([]);
  const valuesRef = useRef(values);
  valuesRef.current = values;
  /** Whether the last save attempt was a publish (decides which body rules apply while fixing errors). */
  const publishingRef = useRef(false);

  const dirty = useMemo(() => !same(values, saved), [values, saved]) || uploading > 0;
  const isNew = !post;
  const live = status === "published";
  const deferredHtml = useDeferredValue(values.content_html);
  const suggestion = useMemo(() => (values.excerpt.trim() ? "" : suggestExcerpt(deferredHtml)), [values.excerpt, deferredHtml]);

  /* ── after creating a post: strip ?saved=… and show what the sanitizer removed (if anything) ── */
  useEffect(() => {
    if (!flash) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("saved");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    try {
      const raw = sessionStorage.getItem(REPORT_KEY);
      sessionStorage.removeItem(REPORT_KEY);
      const items = raw ? (JSON.parse(raw) as unknown) : null;
      if (Array.isArray(items) && items.length) bodyRef.current?.report(items.map(String));
    } catch {
      /* storage blocked: nothing to report */
    }
  }, [flash]);

  /* ── server response ── */
  useEffect(() => {
    if (!state.at) return;
    if (state.ok) {
      const sub = submittedRef.current ?? valuesRef.current;
      const removed = removedRef.current;
      let html = sub.content_html;
      // show the stored version when the sanitizer changed something (unless they kept typing meanwhile)
      if (removed.length && typeof state.html === "string" && normHtml(valuesRef.current.content_html) === normHtml(sub.content_html)) {
        html = bodyRef.current?.adopt(state.html) ?? state.html;
        setValues((v) => ({ ...v, content_html: html }));
      }
      setSaved({ ...sub, content_html: html });
      if (state.status) setStatus(state.status);
      setSavedSlug(normalizeSlug(sub.slug) || savedSlug);
      setErrors({});
      setLegacyNote(false);
      bodyRef.current?.report(removed);
      setNotice({
        tone: "ok",
        text: state.excerptSuggestion
          ? `${state.message} 요약이 비어 있어 본문 첫 부분으로 만든 제안을 ‘요약’ 칸 아래에 준비했습니다.`
          : state.message,
      });
    } else {
      const errs = state.errors ?? {};
      setErrors(errs);
      setNotice({ tone: "error", text: state.message, authExpired: state.authExpired });
      focusField(firstError(errs), errs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  /* ── unsaved-changes guard: tab close/reload, in-app links, other forms (e.g. 로그아웃) ── */
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      if (a.closest('[contenteditable="true"]')) return; // links inside the editor are edited, not followed
      const url = new URL(a.href, window.location.href);
      if (url.pathname === window.location.pathname && url.hash) return;
      if (!window.confirm(LEAVE_MSG)) e.preventDefault();
    };
    const onSubmit = (e: SubmitEvent) => {
      if (e.target === formRef.current || e.defaultPrevented) return;
      if (!window.confirm(LEAVE_MSG)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, [dirty]);

  /* ── live slug check (debounced) ── */
  useEffect(() => {
    const slug = normalizeSlug(values.slug);
    if (!slug || slugError(slug) || slug === savedSlug) {
      setSlugCheck(null);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const res = await checkSlugAction(slug, post?.id ?? null);
        if (!cancelled) setSlugCheck({ ...res, slug });
      } catch {
        /* network hiccup: the save action re-checks anyway */
      }
    }, 450);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [values.slug, savedSlug, post?.id]);

  function focusField(f: FieldName | undefined, errs: FieldErrors = errors) {
    if (!f) return;
    if (f === "content_html") {
      const html = sanitizePostHtml(valuesRef.current.content_html);
      bodyRef.current?.focus({ missingAlt: !!errs.content_html && countMissingAlt(html) > 0 });
      return;
    }
    requestAnimationFrame(() => document.getElementById(fid(f))?.focus());
  }

  function clearError(key: FieldName, extra?: FieldName) {
    if (!errors[key] && !(extra && errors[extra])) return;
    const c = { ...errors };
    delete c[key];
    if (extra) delete c[extra];
    setErrors(c);
    // every flagged field fixed → drop the "저장하지 못했습니다" line too
    if (notice?.tone === "error" && !notice.authExpired && Object.keys(c).length === 0) setNotice(null);
  }

  function set<K extends FieldName>(key: K, value: string) {
    setValues((v) => {
      const next = { ...v, [key]: value };
      if (key === "title" && !slugTouched) next.slug = slugifyClient(value);
      return next;
    });
    clearError(key, key === "title" && !slugTouched ? "slug" : undefined);
    if (notice?.tone === "ok") setNotice(null);
  }

  const onBodyChange = useCallback((html: string) => {
    if (valuesRef.current.content_html === html) return;
    setValues((v) => ({ ...v, content_html: html }));
    // a flagged body is re-checked (not just cleared): the message stays until the problem is fixed
    setErrors((e) => {
      if (!e.content_html) return e;
      const next = validatePost({ ...valuesRef.current, content_html: sanitizePostHtml(html) }, { publishing: publishingRef.current }).errors
        .content_html;
      if (next === e.content_html) return e;
      const c = { ...e };
      if (next) c.content_html = next;
      else delete c.content_html;
      return c;
    });
    setNotice((nt) => (nt?.tone === "ok" ? null : nt));
  }, []);

  /** The editor's serialization of the untouched initial body is the saved state, not an edit. */
  const onBodyBaseline = useCallback(
    (html: string) => {
      setValues((v) => (v.content_html === initial.content_html ? { ...v, content_html: html } : v));
      setSaved((s) => (s.content_html === initial.content_html ? { ...s, content_html: html } : s));
    },
    [initial.content_html],
  );

  function onSlugChange(value: string) {
    // emptied → follow the title again (and an empty slug is derived from the title on save)
    setSlugTouched(value.trim() !== "");
    set("slug", value);
  }

  /* ── submit ── */
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const want = (submitter?.value || (live ? "update" : "draft")) as SaveIntent;
    const publishing = want === "publish" || (want === "update" && live);
    publishingRef.current = publishing;

    if (uploading > 0) {
      setNotice({ tone: "error", text: `이미지를 올리는 중입니다(${uploading}개). 다 올라간 뒤 다시 눌러 주세요.` });
      return;
    }

    // an empty slug follows the title — fill it now so client and server agree on the saved value
    const vals = values.slug.trim() ? values : { ...values, slug: slugifyClient(values.title) };
    if (vals !== values) setValues(vals);

    // validate exactly what the server will store (same sanitizer, same rules)
    const clean = sanitizePostHtml(vals.content_html);
    const { errors: errs } = validatePost({ ...vals, content_html: clean }, { publishing });
    if (!errs.slug && slugCheck && !slugCheck.ok && slugCheck.slug === normalizeSlug(vals.slug)) errs.slug = slugCheck.message;
    if (Object.keys(errs).length) {
      setErrors(errs);
      setNotice({ tone: "error", text: "저장하지 못했습니다. 표시된 항목을 고친 뒤 다시 눌러 주세요." });
      focusField(firstError(errs), errs);
      return;
    }
    if (want === "unpublish" && !window.confirm("발행을 취소할까요? 이 글은 사이트에서 바로 내려가고 초안으로 남습니다.")) return;

    const removed = removedParts(vals.content_html, clean);
    removedRef.current = removed;
    if (isNew) {
      try {
        if (removed.length) sessionStorage.setItem(REPORT_KEY, JSON.stringify(removed));
        else sessionStorage.removeItem(REPORT_KEY);
      } catch {
        /* storage blocked: the report is skipped */
      }
    }

    const fd = new FormData();
    if (post) fd.set("id", String(post.id));
    fd.set("intent", want);
    for (const k of FIELDS) fd.set(k, vals[k]);
    submittedRef.current = vals;
    setIntent(want);
    setNotice(null);
    startTransition(() => dispatch(fd));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      formRef.current?.requestSubmit(primarySaveRef.current ?? undefined);
    }
  }

  /* ── render helpers ── */
  const aria = (f: FieldName, describedBy?: string) => ({
    id: fid(f),
    name: f,
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": [errors[f] ? eid(f) : null, describedBy].filter(Boolean).join(" ") || undefined,
  });
  const err = (f: FieldName) =>
    errors[f] ? (
      <p id={eid(f)} className={field.error}>
        <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
        {errors[f]}
      </p>
    ) : null;

  const excerptLen = values.excerpt.length;
  const slugNow = normalizeSlug(values.slug) || slugifyClient(values.title);
  const slugChanged = !isNew && live && savedSlug && slugNow !== savedSlug;
  /** Public section of the post: from the field being edited (preview) and from what is saved (live link). */
  const sectionNow = CATEGORY_SECTION[toCategory(values.category) ?? DEFAULT_CATEGORY];
  const savedCategory = toCategory(saved.category) ?? DEFAULT_CATEGORY;

  const busyLabel: Record<SaveIntent, string> = {
    draft: "임시저장 중…",
    publish: "발행 중…",
    update: "저장 중…",
    unpublish: "발행 취소 중…",
  };
  const spinner = (want: SaveIntent, icon: ReactNode, label: string) =>
    pending && intent === want ? (
      <>
        <LoaderCircle aria-hidden className="animate-spin" />
        {busyLabel[want]}
      </>
    ) : (
      <>
        {icon}
        {label}
      </>
    );

  let statusLine: ReactNode;
  if (pending) statusLine = <span className="text-muted-ink">{intent ? busyLabel[intent] : "저장 중…"}</span>;
  else if (notice)
    statusLine = (
      <span className={"flex items-start gap-1.5 " + (notice.tone === "ok" ? "text-pine" : "text-[#b42318]")}>
        {notice.tone === "ok" ? (
          <CircleCheck aria-hidden className="mt-0.5 size-[18px] shrink-0 text-leaf" />
        ) : (
          <CircleAlert aria-hidden className="mt-0.5 size-[18px] shrink-0" />
        )}
        <span>
          {notice.text}
          {notice.authExpired ? (
            <>
              {" "}
              <a href="/admin/login/" target="_blank" rel="noopener" className="font-semibold text-action underline underline-offset-4">
                새 탭에서 로그인
              </a>
            </>
          ) : null}
        </span>
      </span>
    );
  else if (uploading) statusLine = <span className="text-muted-ink">이미지를 올리는 중입니다. 다 올라간 뒤 저장해 주세요.</span>;
  else if (dirty) statusLine = <span className="text-muted-ink">저장하지 않은 변경사항이 있습니다.</span>;
  else if (!isNew) statusLine = <span className="text-muted-ink">모든 변경사항이 저장되어 있습니다.</span>;
  else statusLine = <span className="text-muted-ink">제목을 쓰고 임시저장하면 언제든 이어서 쓸 수 있습니다.</span>;

  return (
    <>
      {/* page head */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/" className={`${btn.ghost} -ml-3 px-3`}>
          <ArrowLeft aria-hidden />글 목록
        </Link>
        {!isNew && live && savedSlug ? (
          <a href={postHref(savedCategory, savedSlug)} target="_blank" rel="noopener" className={btn.row}>
            사이트에서 보기
            <ArrowUpRight aria-hidden />
            <span className="sr-only">(새 탭)</span>
          </a>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-[-0.03em] text-pine sm:text-[38px]">
          {isNew ? "새 글 쓰기" : "글 편집"}
        </h1>
        {!isNew ? <StatusBadge status={status} /> : null}
      </div>
      {post ? (
        <p className="mt-1.5 text-[14px] text-muted-ink">
          {post.published_at && live ? `처음 발행 ${formatKst(post.published_at)} · ` : ""}마지막 수정 {formatKst(post.updated_at)}
        </p>
      ) : (
        <p className="mt-1.5 text-[15px] text-muted-ink">임시저장한 글은 사이트에 보이지 않습니다. 발행을 눌러야 블로그에 올라갑니다.</p>
      )}

      <form ref={formRef} onSubmit={onSubmit} onKeyDown={onKeyDown} noValidate className="mt-7">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
          {/* ── 제목 · 본문 ── */}
          <section aria-labelledby="sec-body" className={`${card} min-w-0 p-4 sm:p-7`}>
            <h2 id="sec-body" className="sr-only">
              제목과 본문
            </h2>
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor={fid("title")} className={field.label}>
                제목 <span className="text-[#b42318]" aria-hidden>*</span>
                <span className="sr-only">(필수)</span>
              </label>
              <span className="text-[13px] tabular-nums text-muted-ink">
                {values.title.length}/{LIMITS.title}
              </span>
            </div>
            <input
              {...aria("title")}
              type="text"
              required
              maxLength={LIMITS.title}
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="예: 입주 전 새집증후군 시공, 언제 하면 좋을까"
              className={`${field.input} min-h-14 font-display text-[19px] font-bold sm:text-[21px]`}
              autoComplete="off"
            />
            {err("title")}

            <div className="mt-7">
              <span id="l-body" className={field.label}>
                본문
              </span>
              <p id="h-body" className={`${field.hint} mt-1`}>
                블로그와 같은 글꼴로 보입니다. 소제목·목록·표·이미지는 위 도구 막대로 넣고, Ctrl/⌘+S로 저장합니다.
              </p>
              <div className="mt-3">
                <BodyEditor
                  ref={bodyRef}
                  value={values.content_html}
                  onChange={onBodyChange}
                  onBaseline={onBodyBaseline}
                  onUploadingChange={setUploading}
                  inputId={fid("content_html")}
                  labelId="l-body"
                  describedBy={[errors.content_html ? eid("content_html") : null, "h-body"].filter(Boolean).join(" ")}
                  invalid={!!errors.content_html}
                  title={values.title}
                  legacyNote={legacyNote}
                />
              </div>
              {err("content_html")}
            </div>
          </section>

          {/* ── 글 정보 / 목록에 보이는 모습 ── */}
          <div className="grid min-w-0 gap-6">
            <section aria-labelledby="sec-info" className={`${card} p-5 sm:p-7`}>
              <h2 id="sec-info" className="font-display text-[20px] font-bold text-pine">
                글 정보
              </h2>

              {/* 주소 */}
              <div className="mt-5">
                <label htmlFor={fid("slug")} className={field.label}>
                  주소
                </label>
                <input
                  {...aria("slug", "h-slug")}
                  type="text"
                  maxLength={LIMITS.slug}
                  value={values.slug}
                  onChange={(e) => onSlugChange(e.target.value)}
                  placeholder="제목을 쓰면 자동으로 채워집니다"
                  className={field.input}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                {slugTouched && values.title.trim() && slugNow !== slugifyClient(values.title) ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSlugTouched(false);
                      set("slug", slugifyClient(values.title));
                    }}
                    className={`${btn.row} mt-2`}
                  >
                    <RefreshCw aria-hidden />
                    제목에서 다시 만들기
                  </button>
                ) : null}
                <p id="h-slug" className={field.hint}>
                  <span className="break-all">
                    knst.co.kr{sectionNow}<strong className="font-semibold text-ink">{slugNow || "…"}</strong>/
                  </span>
                  <br />
                  한글·영문·숫자와 하이픈(-)만 씁니다. 영문은 소문자로 저장됩니다.
                </p>
                {err("slug")}
                {!errors.slug && slugCheck && slugCheck.slug === slugNow ? (
                  <p className={slugCheck.ok ? `${field.hint} flex items-center gap-1.5 text-leaf` : field.error} aria-live="polite">
                    {slugCheck.ok ? <CircleCheck aria-hidden className="size-4" /> : <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />}
                    {slugCheck.message}
                  </p>
                ) : null}
                {slugChanged ? (
                  <p className={`${field.hint} flex items-start gap-1.5 text-action`}>
                    <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
                    발행된 글의 주소를 바꾸면 예전 주소로 들어온 방문자는 글을 찾지 못합니다. 꼭 필요할 때만 바꿔 주세요.
                  </p>
                ) : null}
              </div>

              {/* 분류 */}
              <div className="mt-6">
                <label htmlFor={fid("category")} className={field.label}>
                  분류
                </label>
                <select
                  {...aria("category", "h-category")}
                  value={toCategory(values.category) ?? ""}
                  onChange={(e) => set("category", e.target.value)}
                  className={`${field.input} appearance-auto pr-3`}
                >
                  {toCategory(values.category) ? null : (
                    <option value="" disabled>
                      분류를 고르세요
                    </option>
                  )}
                  {POST_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABEL[c]}
                    </option>
                  ))}
                </select>
                <p id="h-category" className={field.hint}>
                  칼럼·가이드는 블로그(/blog/)에, 공지사항은 /notices/, 언론동향은 /news/에 올라갑니다.
                  {!isNew && live && savedCategory !== toCategory(values.category)
                    ? " 발행된 글의 분류를 바꾸면 주소도 바뀝니다(예전 주소는 새 주소로 넘어갑니다)."
                    : ""}
                </p>
                {err("category")}
              </div>

              {/* 원문 링크 */}
              <div className="mt-6">
                <label htmlFor={fid("source_url")} className={field.label}>
                  원문 링크 <span className="font-normal text-muted-ink">(선택)</span>
                </label>
                <input
                  {...aria("source_url", "h-source")}
                  type="url"
                  inputMode="url"
                  maxLength={LIMITS.url}
                  value={values.source_url}
                  onChange={(e) => set("source_url", e.target.value)}
                  placeholder="https://"
                  className={field.input}
                  autoComplete="off"
                  spellCheck={false}
                />
                <p id="h-source" className={field.hint}>
                  다른 곳에 먼저 올린 글이면 그 주소를 넣으세요.
                </p>
                {err("source_url")}
              </div>
            </section>

            <section aria-labelledby="sec-card" className={`${card} p-5 sm:p-7`}>
              <h2 id="sec-card" className="font-display text-[20px] font-bold text-pine">
                목록·공유에 보이는 모습
              </h2>

              {/* 요약 */}
              <div className="mt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <label htmlFor={fid("excerpt")} className={field.label}>
                    요약
                  </label>
                  <span
                    className={"text-[13px] tabular-nums " + (excerptLen > LIMITS.excerptSeo ? "font-semibold text-action" : "text-muted-ink")}
                    aria-hidden
                  >
                    {excerptLen}/{LIMITS.excerpt}
                  </span>
                </div>
                <textarea
                  {...aria("excerpt", "h-excerpt")}
                  rows={3}
                  maxLength={LIMITS.excerpt}
                  value={values.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  placeholder="글 목록과 검색 결과에 보이는 한두 문장입니다."
                  className={`${field.input} resize-y leading-relaxed`}
                />
                <p id="h-excerpt" className={field.hint + (excerptLen > LIMITS.excerptSeo ? " text-action" : "")}>
                  {excerptLen > LIMITS.excerptSeo
                    ? `지금 ${excerptLen}자입니다. 검색 결과에는 ${LIMITS.excerptSeo}자 안팎까지만 보이니 핵심을 앞쪽에 두세요.`
                    : `${LIMITS.excerptSeo}자 이내를 권장합니다. 비워 두면 목록에 본문 첫 부분이 보입니다.`}
                </p>
                {err("excerpt")}
                {suggestion ? (
                  <div className="mt-3 rounded-2xl border border-leaf/30 bg-mint/35 p-4">
                    <p className="flex items-center gap-1.5 text-[13px] font-semibold text-leaf">
                      <Sparkles aria-hidden className="size-4" />
                      요약 제안 · 본문 첫 부분에서
                    </p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink">{suggestion}</p>
                    <button
                      type="button"
                      onClick={() => {
                        set("excerpt", suggestion.slice(0, LIMITS.excerpt));
                        requestAnimationFrame(() => document.getElementById(fid("excerpt"))?.focus());
                      }}
                      className={`${btn.row} mt-3`}
                    >
                      이 요약 쓰기
                    </button>
                  </div>
                ) : null}
              </div>

              {/* 대표 이미지 */}
              <div className="mt-7">
                <CoverPicker
                  value={values.cover_image}
                  onChange={(v) => set("cover_image", v)}
                  inputProps={aria("cover_image", "h-cover")}
                  maxLength={LIMITS.url}
                  error={err("cover_image")}
                  currentHtml={values.content_html}
                />
              </div>
            </section>
          </div>
        </div>

        {/* ── sticky action bar ── */}
        <div className="sticky bottom-0 z-30 -mx-4 mt-6 border-t border-hairline bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-3xl lg:border lg:px-6 lg:shadow-[0_-10px_40px_-30px_rgba(14,59,50,.6)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div role="status" aria-live="polite" className="min-h-6 text-[14.5px] font-medium leading-relaxed">
              {statusLine}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
              {live ? (
                <>
                  <button type="submit" name="intent" value="unpublish" disabled={pending} className={btn.secondary}>
                    {spinner("unpublish", <Undo2 aria-hidden />, "발행취소")}
                  </button>
                  <button ref={primarySaveRef} type="submit" name="intent" value="update" disabled={pending} className={btn.primary}>
                    {spinner("update", <Save aria-hidden />, "저장")}
                  </button>
                </>
              ) : (
                <>
                  <button ref={primarySaveRef} type="submit" name="intent" value="draft" disabled={pending} className={btn.secondary}>
                    {spinner("draft", <Save aria-hidden />, "임시저장")}
                  </button>
                  <button type="submit" name="intent" value="publish" disabled={pending} className={btn.primary}>
                    {spinner("publish", <Send aria-hidden />, "발행")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
