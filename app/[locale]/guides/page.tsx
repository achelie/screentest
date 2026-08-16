import { createGuidesMetadata, GuidesPageContent } from "@/components/pages/guides-page";
export const dynamic = "force-static";
export const metadata = createGuidesMetadata("zh");
export default function ChineseGuidesPage() { return <GuidesPageContent locale="zh" />; }
