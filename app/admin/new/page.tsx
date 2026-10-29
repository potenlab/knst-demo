import type { Metadata } from "next";
import { requireAdminPage } from "../guard";
import AdminShell from "@/components/admin/AdminShell";
import PostEditor from "@/components/admin/PostEditor";
import { DEFAULT_CATEGORY } from "@/components/admin/post-rules";
import { toCategory } from "@/lib/post-categories";

export const metadata: Metadata = { title: "새 글 쓰기" };

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  await requireAdminPage();
  // "새 글 쓰기" from a filtered list (/admin/?category=notice) starts in that category
  const category = toCategory((await searchParams).category) ?? DEFAULT_CATEGORY;

  return (
    <AdminShell wide>
      <PostEditor
        post={null}
        initial={{ title: "", slug: "", excerpt: "", category, cover_image: "", source_url: "", content_html: "" }}
      />
    </AdminShell>
  );
}
