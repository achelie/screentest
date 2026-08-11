"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import Link from "@/components/site/no-prefetch-link";

type ToolRoute = {
  readonly href: `/${string}`;
  readonly label: string;
};

type SiteNavigationProps = {
  tools: readonly ToolRoute[];
};

export function SiteNavigation({ tools }: SiteNavigationProps) {
  const pathname = usePathname();
  const navigationRef = useRef<HTMLElement>(null);
  const desktopToolsButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const [desktopToolsOpen, setDesktopToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const desktopToolsId = useId();
  const mobileMenuId = useId();
  const mobileToolsId = useId();
  const [allTestsRoute, ...testTools] = tools;
  const isRouteActive = (href: ToolRoute["href"]) => {
    const normalizedHref = href === "/" ? "/" : href.replace(/\/$/u, "");
    return pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);
  };
  const toolsActive = tools.some((tool) => isRouteActive(tool.href));

  const closeAllMenus = useCallback(() => {
    setDesktopToolsOpen(false);
    setMobileMenuOpen(false);
    setMobileToolsOpen(false);
  }, []);

  useEffect(() => {
    closeAllMenus();
  }, [closeAllMenus, pathname]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        navigationRef.current &&
        event.target instanceof Node &&
        !navigationRef.current.contains(event.target)
      ) {
        closeAllMenus();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (mobileMenuOpen) {
        closeAllMenus();
        mobileMenuButtonRef.current?.focus();
      } else if (desktopToolsOpen) {
        setDesktopToolsOpen(false);
        desktopToolsButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeAllMenus, desktopToolsOpen, mobileMenuOpen]);

  const renderToolLinks = (mobile = false) => (
    <>
      <div className={mobile ? "mobile-tools-grid" : "nav-tools-grid"}>
        {testTools.map((tool) => (
          <Link
            aria-current={isRouteActive(tool.href) ? "page" : undefined}
            className="nav-tool-link"
            href={tool.href}
            key={tool.href}
            onClick={closeAllMenus}
          >
            {tool.label}
          </Link>
        ))}
      </div>
      {allTestsRoute ? (
        <Link
          aria-current={pathname === allTestsRoute.href ? "page" : undefined}
          className="nav-all-tools"
          href={allTestsRoute.href}
          onClick={closeAllMenus}
        >
          View all screen tests
        </Link>
      ) : null}
    </>
  );

  return (
    <nav aria-label="Main navigation" className="site-nav" ref={navigationRef}>
      <div className="desktop-nav">
        <div className="nav-tools">
          <button
            aria-controls={desktopToolsId}
            aria-expanded={desktopToolsOpen}
            className="nav-link-button"
            data-active={toolsActive}
            onClick={() => setDesktopToolsOpen((open) => !open)}
            ref={desktopToolsButtonRef}
            type="button"
          >
            Tools
            <ChevronDown aria-hidden="true" size={16} strokeWidth={1.8} />
          </button>
          {desktopToolsOpen ? (
            <div
              aria-label="Screen test tools"
              className="nav-tools-menu"
              id={desktopToolsId}
            >
              {renderToolLinks()}
            </div>
          ) : null}
        </div>
        <Link
          aria-current={pathname === "/guides" ? "page" : undefined}
          data-active={pathname.startsWith("/guides")}
          href="/guides"
        >
          Guides
        </Link>
        <Link className="nav-start" href="/tests/guided">
          Start check
        </Link>
      </div>

      <button
        aria-controls={mobileMenuId}
        aria-expanded={mobileMenuOpen}
        aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
        className="mobile-menu-toggle"
        onClick={() => {
          setMobileMenuOpen((open) => !open);
          setMobileToolsOpen(false);
        }}
        ref={mobileMenuButtonRef}
        type="button"
      >
        {mobileMenuOpen ? (
          <X aria-hidden="true" size={24} strokeWidth={1.8} />
        ) : (
          <Menu aria-hidden="true" size={24} strokeWidth={1.8} />
        )}
      </button>

      {mobileMenuOpen ? (
        <div className="mobile-nav-panel" id={mobileMenuId}>
          <button
            aria-controls={mobileToolsId}
            aria-expanded={mobileToolsOpen}
            className="mobile-nav-row mobile-tools-toggle"
            data-active={toolsActive}
            onClick={() => setMobileToolsOpen((open) => !open)}
            type="button"
          >
            Tools
            <ChevronDown aria-hidden="true" size={18} strokeWidth={1.8} />
          </button>
          {mobileToolsOpen ? (
            <div className="mobile-tools-menu" id={mobileToolsId}>
              {renderToolLinks(true)}
            </div>
          ) : null}
          <Link
            aria-current={pathname === "/guides" ? "page" : undefined}
            className="mobile-nav-row"
            data-active={pathname.startsWith("/guides")}
            href="/guides"
            onClick={closeAllMenus}
          >
            Guides
          </Link>
          <Link
            className="mobile-nav-row mobile-nav-start"
            href="/tests/guided"
            onClick={closeAllMenus}
          >
            Start check
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
