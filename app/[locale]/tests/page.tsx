import { createTestsMetadata, TestsPageContent } from "@/components/pages/tests-page";
export const metadata = createTestsMetadata("zh");
export default function ChineseTestsPage() { return <TestsPageContent locale="zh" />; }
