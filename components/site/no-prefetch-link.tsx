import NextLink from "next/link";
import type { ComponentProps } from "react";

type NoPrefetchLinkProps = Omit<ComponentProps<typeof NextLink>, "prefetch">;

/**
 * Keep client-side navigation without starting background RSC requests.
 *
 * Automatic App Router prefetching entered a retry loop on the Workers
 * deployment, so every site link opts out until that upstream behavior is
 * proven safe for this runtime.
 */
export default function NoPrefetchLink(props: NoPrefetchLinkProps) {
  return <NextLink {...props} prefetch={false} />;
}
