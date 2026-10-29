import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { getPublishedBySlug } from "@/lib/db";
import { isBlogCategory, postPathFor } from "@/lib/post-categories";
import PostArticle, { decodeSlug, postMetadata } from "../_components/PostArticle";

type Params = Promise<{ slug: string }>;

/** One D1 read per request, shared by generateMetadata and the page. Drafts/missing → null. */
const getPost = cache((slug: string) => getPublishedBySlug(decodeSlug(slug)));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return postMetadata(post);
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  // 공지사항 / 언론동향 live under their own sections (slugs are unique across all posts)
  if (!isBlogCategory(post.category)) permanentRedirect(postPathFor(post.category, post.slug));
  return <PostArticle post={post} />;
}
