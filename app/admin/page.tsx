import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FilePlus2, Pencil, Trash, Undo2, Send } from "lucide-react";
import { listAll, type PostStatus } from "@/lib/db";
import { CATEGORY_LABEL, CATEGORY_SECTION, POST_CATEGORIES, categoryLabel, isPostCategory, type PostCategory } from "@/lib/post-categories";
import { requireAdminPage } from "./guard";
import { deletePostAction, setStatusAction } from "./actions";
import AdminShell from "@/components/admin/AdminShell";
import Flash from "@/components/admin/Flash";
import StatusBadge from "@/components/admin/StatusBadge";
import { SubmitButton } from "@/components/admin/FormButtons";
import { formatKst, hostOf, postHref } from "@/components/admin/format";
import { btn, card } from "@/components/admin/styles";

export const metadata: Metadata = { title: "글 목록" };

const NOTICES: Record<string, { message: string; tone?: "warn" }> = {
  published: { message: "발행되었습니다. 이제 블로그에서 누구나 볼 수 있습니다." },
  unpublished: { message: "발행이 취소되었습니다. 글은 초안으로 남고 사이트에서는 내려갔습니다." },
  deleted: { message: "삭제되었습니다." },
  empty: { message: "본문이 비어 있어 발행하지 않았습니다. 편집에서 본문을 채운 뒤 발행해 주세요.", tone: "warn" },
  alt: {
    message: "설명(대체 텍스트)이 없는 이미지가 있어 발행하지 않았습니다. 편집에서 빨간 점선으로 표시된 이미지에 설명을 적거나 ‘장식용 이미지’로 표시한 뒤 발행해 주세요.",
    tone: "warn",
  },
  missing: { message: "그 글을 찾을 수 없습니다. 이미 삭제됐을 수 있습니다.", tone: "warn" },
  invalid: { message: "잘못된 요청이라 처리하지 않았습니다. 목록에서 다시 시도해 주세요.", tone: "warn" },
};

type Filter = "all" | PostStatus;

/** /admin/ list URL for a status × category filter. */
function listHref(status: Filter, category: PostCategory | undefined) {
  const qs = new URLSearchParams();
  if (status !== "all") qs.set("status", status);
  if (category) qs.set("category", category);
  const q = qs.toString();
  return q ? `/admin/?${q}` : "/admin/";
}

const chip = (active: boolean) =>
  "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[15px] font-semibold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-action/40 " +
  (active ? "border-pine bg-pine text-white" : "border-hairline bg-white text-pine hover:border-pine/40");

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; status?: string; category?: string }>;
}) {
  await requireAdminPage();
  const sp = await searchParams;
  const posts = await listAll();

  const filter: Filter = sp.status === "published" || sp.status === "draft" ? sp.status : "all";
  const category = isPostCategory(sp.category) ? sp.category : undefined;
  const inCategory = category ? posts.filter((p) => p.category === category) : posts;
  const counts = {
    all: inCategory.length,
    published: inCategory.filter((p) => p.status === "published").length,
    draft: inCategory.filter((p) => p.status === "draft").length,
  };
  const inStatus = filter === "all" ? posts : posts.filter((p) => p.status === filter);
  const categoryCounts = Object.fromEntries(POST_CATEGORIES.map((c) => [c, inStatus.filter((p) => p.category === c).length])) as Record<
    PostCategory,
    number
  >;
  const shown = filter === "all" ? inCategory : inCategory.filter((p) => p.status === filter);
  const notice = sp.notice ? NOTICES[sp.notice] : undefined;

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "published", label: "발행" },
    { key: "draft", label: "초안" },
  ];
  const newHref = category ? `/admin/new/?category=${category}` : "/admin/new/";

  return (
    <AdminShell>
      {notice ? <Flash key={sp.notice} message={notice.message} tone={notice.tone === "warn" ? "warn" : "ok"} param="notice" /> : null}

      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
        <div>
          <p className="text-[13px] font-semibold tracking-[0.16em] text-leaf">블로그 관리</p>
          <h1 className="mt-1 font-display text-[34px] font-extrabold leading-tight tracking-[-0.03em] text-pine sm:text-[40px]">글 목록</h1>
        </div>
        <Link href={newHref} className={btn.primary}>
          <FilePlus2 aria-hidden />
          새 글 쓰기
        </Link>
      </div>

      {/* counts double as filters: status × category */}
      <nav aria-label="상태별 보기" className="mt-7 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = t.key === filter;
          return (
            <Link key={t.key} href={listHref(t.key, category)} aria-current={active ? "page" : undefined} className={chip(active)}>
              {t.label}
              <span className={"tabular-nums " + (active ? "text-glow" : "text-muted-ink")}>{counts[t.key]}</span>
            </Link>
          );
        })}
      </nav>
      <nav aria-label="분류별 보기" className="mt-2 flex flex-wrap gap-2">
        <Link href={listHref(filter, undefined)} aria-current={!category ? "page" : undefined} className={chip(!category)}>
          모든 분류
          <span className={"tabular-nums " + (!category ? "text-glow" : "text-muted-ink")}>{inStatus.length}</span>
        </Link>
        {POST_CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <Link key={c} href={listHref(filter, c)} aria-current={active ? "page" : undefined} className={chip(active)}>
              {CATEGORY_LABEL[c]}
              <span className={"tabular-nums " + (active ? "text-glow" : "text-muted-ink")}>{categoryCounts[c]}</span>
            </Link>
          );
        })}
      </nav>

      {posts.length === 0 ? (
        <section className={`${card} mt-6 px-6 py-14 text-center sm:px-10`}>
          <div aria-hidden className="mx-auto grid size-16 place-items-center rounded-full bg-mint text-pine">
            <FilePlus2 className="size-7" />
          </div>
          <h2 className="mt-5 font-display text-[24px] font-bold text-pine">아직 쓴 글이 없습니다</h2>
          <p className="mx-auto mt-2 max-w-[440px] text-[15.5px] leading-relaxed text-muted-ink">
            첫 글을 써 보세요. 임시저장한 글은 사이트에 보이지 않고, <strong className="text-ink">발행</strong>을 눌러야 블로그에 올라갑니다.
          </p>
          <Link href="/admin/new/" className={`${btn.primary} mt-7`}>
            <FilePlus2 aria-hidden />
            새 글 쓰기
          </Link>
        </section>
      ) : shown.length === 0 ? (
        <section className={`${card} mt-6 px-6 py-12 text-center`}>
          <h2 className="font-display text-[21px] font-bold text-pine">
            {category ? `‘${CATEGORY_LABEL[category]}’ 분류에 ` : ""}
            {filter === "draft" ? "초안이 없습니다" : filter === "published" ? "발행한 글이 없습니다" : "글이 없습니다"}
          </h2>
          <p className="mt-2 text-[15px] text-muted-ink">
            <Link href="/admin/" className="font-semibold text-action underline underline-offset-4">
              전체 글 보기
            </Link>
          </p>
        </section>
      ) : (
        <section aria-label="글" className={`${card} mt-6 overflow-hidden`}>
          {/* column heads (desktop only; each row also carries its own labels for screen readers) */}
          <div
            aria-hidden
            className="hidden grid-cols-[minmax(0,1fr)_80px_392px] items-center gap-6 border-b border-hairline bg-air/70 px-6 py-3 text-[13px] font-semibold text-muted-ink lg:grid"
          >
            <span>제목 · 분류 · 수정 · 출처</span>
            <span>상태</span>
            <span className="text-right">작업</span>
          </div>
          <ul className="divide-y divide-hairline">
            {shown.map((p) => {
              const live = p.status === "published";
              const host = hostOf(p.source_url);
              return (
                <li
                  key={p.id}
                  className="grid gap-3 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_80px_392px] lg:items-center lg:gap-6 lg:py-4"
                >
                  <div className="min-w-0">
                    <h2 className="text-[17px] font-bold leading-snug text-ink">
                      <Link
                        href={`/admin/${p.id}/`}
                        className="rounded outline-none hover:text-action hover:underline hover:underline-offset-4 focus-visible:ring-3 focus-visible:ring-action/40"
                      >
                        {p.title || "(제목 없음)"}
                      </Link>
                    </h2>
                    <p className="mt-0.5 truncate text-[13.5px] text-muted-ink">
                      {CATEGORY_SECTION[p.category] ?? "/blog/"}
                      {p.slug}/
                    </p>

                    <dl className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[14px] text-muted-ink">
                      <div className="lg:hidden">
                        <dt className="sr-only">상태</dt>
                        <dd>
                          <StatusBadge status={p.status} />
                        </dd>
                      </div>
                      <div>
                        <dt className="sr-only">분류</dt>
                        <dd className="rounded-full bg-mint/70 px-2.5 py-0.5 text-[13px] font-semibold text-pine">{categoryLabel(p.category)}</dd>
                      </div>
                      <div className="flex gap-1">
                        <dt>수정</dt>
                        <dd className="tabular-nums">
                          <time dateTime={p.updated_at}>{formatKst(p.updated_at)}</time>
                        </dd>
                      </div>
                      <div className="flex min-w-0 gap-1">
                        <dt>출처</dt>
                        <dd className="truncate">
                          {host && p.source_url ? (
                            <a
                              href={p.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-action underline-offset-4 hover:underline"
                              title={p.source_url}
                            >
                              {host}
                              <ArrowUpRight aria-hidden className="size-3.5" />
                              <span className="sr-only">(원문, 새 탭)</span>
                            </a>
                          ) : (
                            "직접 작성"
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div aria-hidden className="hidden lg:block">
                    <StatusBadge status={p.status} />
                  </div>

                  <div className="flex flex-wrap gap-2 lg:flex-nowrap lg:justify-end">
                    <Link href={`/admin/${p.id}/`} className={btn.row}>
                      <Pencil aria-hidden />
                      편집
                    </Link>
                    <form action={setStatusAction.bind(null, p.id, live ? "draft" : "published")}>
                      <SubmitButton
                        className={btn.row}
                        pendingLabel={live ? "내리는 중…" : "발행 중…"}
                        confirmMessage={live ? `「${p.title}」의 발행을 취소할까요? 사이트에서 바로 내려갑니다.` : undefined}
                      >
                        {live ? <Undo2 aria-hidden /> : <Send aria-hidden />}
                        {live ? "발행취소" : "발행"}
                      </SubmitButton>
                    </form>
                    <form action={deletePostAction.bind(null, p.id)}>
                      <SubmitButton
                        className={btn.rowDanger}
                        pendingLabel="삭제 중…"
                        confirmMessage={`「${p.title}」을(를) 삭제할까요? 삭제하면 되돌릴 수 없습니다.`}
                      >
                        <Trash aria-hidden />
                        삭제
                      </SubmitButton>
                    </form>
                    {live ? (
                      <a href={postHref(p.category, p.slug)} target="_blank" rel="noopener" className={btn.row}>
                        보기
                        <ArrowUpRight aria-hidden />
                        <span className="sr-only">(사이트에서 새 탭으로)</span>
                      </a>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </AdminShell>
  );
}
