import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Trash } from "lucide-react";
import { getById } from "@/lib/db";
import { requireAdminPage } from "../guard";
import { deletePostAction } from "../actions";
import { markdownToPostHtml } from "../legacy-markdown";
import AdminShell from "@/components/admin/AdminShell";
import PostEditor from "@/components/admin/PostEditor";
import { SubmitButton } from "@/components/admin/FormButtons";
import { btn, card } from "@/components/admin/styles";
import { DEFAULT_CATEGORY, type SaveIntent } from "@/components/admin/post-rules";
import { toCategory } from "@/lib/post-categories";

export const metadata: Metadata = { title: "글 편집" };

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdminPage();
  const [{ id: idParam }, sp] = await Promise.all([params, searchParams]);

  const id = /^\d{1,12}$/.test(idParam) ? Number(idParam) : NaN;
  if (!Number.isSafeInteger(id) || id <= 0) notFound();
  const post = await getById(id);
  if (!post) notFound();

  // legacy rows: markdown only → open them as HTML (stored as HTML on the next save; content_md is kept)
  const legacy = !post.content_html.trim() && !!post.content_md.trim();
  const contentHtml = legacy ? markdownToPostHtml(post.content_md) : post.content_html;
  const flash: SaveIntent | undefined = sp.saved === "publish" ? "publish" : sp.saved === "draft" ? "draft" : undefined;

  return (
    <AdminShell wide>
      <PostEditor
        key={post.id}
        flash={flash}
        legacyConverted={legacy}
        post={{ id: post.id, status: post.status, slug: post.slug, published_at: post.published_at, updated_at: post.updated_at }}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          category: toCategory(post.category) ?? DEFAULT_CATEGORY,
          cover_image: post.cover_image ?? "",
          source_url: post.source_url ?? "",
          content_html: contentHtml,
        }}
      />

      <section aria-labelledby="sec-danger" className={`${card} mt-10 flex flex-col gap-4 border-[#b42318]/20 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8`}>
        <div>
          <h2 id="sec-danger" className="font-display text-[19px] font-bold text-[#8a1c13]">
            글 삭제
          </h2>
          <p className="mt-1 text-[14.5px] leading-relaxed text-muted-ink">
            삭제하면 되돌릴 수 없습니다. 잠시 내리기만 하려면 <strong className="text-ink">발행취소</strong>를 쓰세요.
          </p>
        </div>
        <form action={deletePostAction.bind(null, post.id)}>
          <SubmitButton
            className={`${btn.danger} w-full sm:w-auto`}
            pendingLabel="삭제 중…"
            confirmMessage={`「${post.title}」을(를) 삭제할까요? 삭제하면 되돌릴 수 없습니다.`}
          >
            <Trash aria-hidden />
            이 글 삭제
          </SubmitButton>
        </form>
      </section>
    </AdminShell>
  );
}
