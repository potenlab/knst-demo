import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BoardIndex, { boardMetadata } from "../blog/_components/BoardIndex";
import { SECTIONS, pageParam } from "../blog/_lib/blog";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const SECTION = SECTIONS.news;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  return boardMetadata(SECTION, pageParam((await searchParams).page));
}

/** /news/ — every published 'news' post, newest first. */
export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const view = await BoardIndex({ section: SECTION, page: pageParam((await searchParams).page), eyebrow: "보도" });
  if (!view) notFound();
  return view;
}
