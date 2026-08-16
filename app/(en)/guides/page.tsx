import { createGuidesMetadata, GuidesPageContent } from "@/components/pages/guides-page";

export const dynamic = "force-static";
export const metadata = createGuidesMetadata("en");

export default function GuidesPage() {
  return <GuidesPageContent locale="en" />;
}
