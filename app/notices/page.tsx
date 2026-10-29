import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import BoardIndex, { boardMetadata } from "../blog/_components/BoardIndex";
import { SECTIONS, pageParam } from "../blog/_lib/blog";
import { OLD_NOTICE_UIDS } from "@/lib/old-notice-uids";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const SECTION = SECTIONS.notices;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  return boardMetadata(SECTION, pageParam((await searchParams).page));
}

/** /notices/ — every published 'notice' post, newest first. */
export default async function NoticesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const oldSlug = typeof params.uid === "string" ? OLD_NOTICE_UIDS[params.uid] : undefined;
  if (oldSlug) permanentRedirect(`/notices/${encodeURIComponent(oldSlug)}/`);
  const view = await BoardIndex({ section: SECTION, page: pageParam(params.page), eyebrow: "소식" });
  if (!view) notFound();
  return view;
}
