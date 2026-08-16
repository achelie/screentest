import { createHomeMetadata, HomePageContent } from "@/components/pages/home-page";
export const dynamic = "force-static";
export const metadata = createHomeMetadata("zh");
export default function ChineseHomePage() { return <HomePageContent locale="zh" />; }
