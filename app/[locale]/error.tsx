"use client";
import { RouteLocalizedError } from "@/components/site/localized-states";
export default function ErrorPage(props: { error: Error & { digest?: string }; reset: () => void }) { return <RouteLocalizedError {...props} />; }
