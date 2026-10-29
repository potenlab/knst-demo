import SectionNotFound from "../blog/_components/SectionNotFound";
import { SECTIONS } from "../blog/_lib/blog";

export default function NewsNotFound() {
  return <SectionNotFound section={SECTIONS.news} />;
}
