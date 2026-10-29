import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { getPublishedBySlug } from "@/lib/db";
import { postPathFor } from "@/lib/post-categories";
import PostArticle, { decodeSlug, postMetadata } from "../../blog/_components/PostArticle";

type Params = Promise<{ slug: string }>;

/** One D1 read per request, shared by generateMetadata and the page. Drafts/missing → null. */
const getPost = cache((slug: string) => getPublishedBySlug(decodeSlug(slug)));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return postMetadata(await getPost((await params).slug));
}

export default async function NewsPostPage({ params }: { params: Params }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  // a post that belongs to another section (or was re-categorised in the admin) moves with its category
  if (post.category !== "news") permanentRedirect(postPathFor(post.category, post.slug));
  return <PostArticle post={post} />;
}
