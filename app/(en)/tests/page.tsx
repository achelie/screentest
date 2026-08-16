import { createTestsMetadata, TestsPageContent } from "@/components/pages/tests-page";

export const metadata = createTestsMetadata("en");

export default function TestsPage() {
  return <TestsPageContent locale="en" />;
}
