import SectionNotFound from "../blog/_components/SectionNotFound";
import { SECTIONS } from "../blog/_lib/blog";

export default function NoticesNotFound() {
  return <SectionNotFound section={SECTIONS.notices} />;
}
