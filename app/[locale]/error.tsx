"use client";
import { LocalizedError } from "@/components/site/localized-states";
export default function ErrorPage(props: { error: Error & { digest?: string }; reset: () => void }) { return <LocalizedError {...props} locale="zh" />; }
