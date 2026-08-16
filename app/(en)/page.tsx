import { createHomeMetadata, HomePageContent } from "@/components/pages/home-page";

export const dynamic = "force-static";
export const metadata = createHomeMetadata("en");

export default function HomePage() {
  return <HomePageContent locale="en" />;
}
