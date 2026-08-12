"use client";

import {
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Maximize2,
  Minimize2,
  TriangleAlert,
} from "lucide-react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import styles from "./ScreenTests.module.css";

type FullscreenTestProps = {
  name: string;
  surfaceLabel: string;
  status: string;
  children: ReactNode;
  controls?: ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  canHideControls?: boolean;
  advanceOnSurfaceClick?: boolean;
  startEventName?: string;
  toolbarLayout?: "overlay" | "docked";
};

const CONTROLS_IDLE_DELAY_MS = 1000;

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    Boolean(target.closest("button, input, select, textarea, a, [contenteditable='true']"))
  );
}

export function FullscreenTest({
  name,
  surfaceLabel,
  status,
  children,
  controls,
  onPrevious,
  onNext,
  canHideControls = true,
  advanceOnSurfaceClick = false,
  startEventName,
  toolbarLayout = "overlay",
}: FullscreenTestProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const focusFrameRef = useRef<number | null>(null);
  const controlsTimerRef = useRef<number | null>(null);
  const noticeId = useId();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState<boolean | null>(
    null,
  );
  const [controlsHidden, setControlsHidden] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearControlsTimer = useCallback(() => {
    if (controlsTimerRef.current !== null) {
      window.clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = null;
    }
  }, []);

  const hideControls = useCallback(() => {
    clearControlsTimer();
    setControlsHidden(true);
    focusFrameRef.current = requestAnimationFrame(() => {
      hostRef.current?.focus({ preventScroll: true });
    });
  }, [clearControlsTimer]);

  const scheduleControlsHide = useCallback(() => {
    clearControlsTimer();

    if (!isFullscreen || !canHideControls) {
      return;
    }

    controlsTimerRef.current = window.setTimeout(
      hideControls,
      CONTROLS_IDLE_DELAY_MS,
    );
  }, [canHideControls, clearControlsTimer, hideControls, isFullscreen]);

  useEffect(() => {
    setFullscreenSupported(
      Boolean(document.fullscreenEnabled && hostRef.current?.requestFullscreen),
    );

    const handleFullscreenChange = () => {
      const active = document.fullscreenElement === hostRef.current;
      clearControlsTimer();
      setIsFullscreen(active);
      setControlsHidden(false);

      if (focusFrameRef.current !== null) {
        cancelAnimationFrame(focusFrameRef.current);
      }

      focusFrameRef.current = requestAnimationFrame(() => {
        if (active) {
          toolbarRef.current?.focus({ preventScroll: true });
        } else {
          restoreFocusRef.current?.focus({ preventScroll: true });
          restoreFocusRef.current = null;
        }
      });
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (focusFrameRef.current !== null) {
        cancelAnimationFrame(focusFrameRef.current);
      }
      clearControlsTimer();
    };
  }, [clearControlsTimer]);

  useEffect(() => {
    if (!isFullscreen) {
      clearControlsTimer();
      return;
    }

    scheduleControlsHide();
    return clearControlsTimer;
  }, [clearControlsTimer, isFullscreen, scheduleControlsHide]);

  const toggleFullscreen = useCallback(async () => {
    const host = hostRef.current;

    if (!host || !document.fullscreenEnabled || !host.requestFullscreen) {
      setFullscreenSupported(false);
      setError(
        "Fullscreen is not available here. The test still works inside this page.",
      );
      return;
    }

    setError(null);

    try {
      if (document.fullscreenElement === host) {
        await document.exitFullscreen();
      } else {
        restoreFocusRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        await host.requestFullscreen();
      }
    } catch {
      setError(
        "The browser refused fullscreen. Try the button again or use the browser's fullscreen command.",
      );
    }
  }, []);

  useEffect(() => {
    if (!startEventName) return;

    const handleStartRequest = () => void toggleFullscreen();
    window.addEventListener(startEventName, handleStartRequest);
    return () => window.removeEventListener(startEventName, handleStartRequest);
  }, [startEventName, toggleFullscreen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isInteractiveTarget(event.target)
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "h" && canHideControls) {
        event.preventDefault();
        if (controlsHidden) {
          setControlsHidden(false);
          scheduleControlsHide();
        } else {
          hideControls();
        }
        return;
      }

      if (controlsHidden && key !== "escape") {
        setControlsHidden(false);
        scheduleControlsHide();
      }

      if (key === "f") {
        event.preventDefault();
        void toggleFullscreen();
      } else if (event.key === "ArrowLeft" && onPrevious) {
        event.preventDefault();
        onPrevious();
      } else if (event.key === "ArrowRight" && onNext) {
        event.preventDefault();
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    canHideControls,
    controlsHidden,
    hideControls,
    onNext,
    onPrevious,
    scheduleControlsHide,
    toggleFullscreen,
  ]);

  const handlePointerMove = () => {
    if (!canHideControls) {
      return;
    }

    if (controlsHidden) {
      setControlsHidden(false);
    }

    scheduleControlsHide();
  };

  const handlePointerDown = () => {
    if (!isFullscreen && controlsHidden) {
      setControlsHidden(false);
    }

    scheduleControlsHide();
  };

  const handleSurfaceClick = () => {
    if (!isFullscreen || !advanceOnSurfaceClick || !onNext) {
      return;
    }

    onNext();
    scheduleControlsHide();
  };

  return (
    <>
      <div
        aria-describedby={noticeId}
        aria-keyshortcuts="F H ArrowLeft ArrowRight"
        className={styles.fullscreenHost}
        data-controls-hidden={controlsHidden}
        data-toolbar-layout={toolbarLayout}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        ref={hostRef}
        tabIndex={-1}
      >
        <div
          aria-label={surfaceLabel}
          className={styles.testSurface}
          onClick={handleSurfaceClick}
          role="img"
        >
          {children}
        </div>

        <div
          aria-label={`${name} controls`}
          aria-hidden={controlsHidden}
          className={styles.toolbar}
          inert={controlsHidden}
          ref={toolbarRef}
          tabIndex={-1}
        >
          <div className={styles.toolbarHeader}>
            <div>
              <p className={styles.toolbarTitle}>{name}</p>
              <p aria-live="polite" className={styles.toolbarStatus}>
                {status}
              </p>
            </div>
            <span className={styles.toolbarStatus}>F fullscreen, H hide controls</span>
          </div>

          <div className={styles.toolbarBody}>
            <div className={styles.toolControls}>{controls}</div>
            <div className={styles.toolbarActions}>
              {onPrevious ? (
                <button
                  aria-label="Previous pattern"
                  className={styles.toolButton}
                  onClick={onPrevious}
                  type="button"
                >
                  <ChevronLeft aria-hidden="true" size={18} strokeWidth={1.8} />
                  Previous
                </button>
              ) : null}
              {onNext ? (
                <button
                  aria-label="Next pattern"
                  className={styles.toolButton}
                  onClick={onNext}
                  type="button"
                >
                  Next
                  <ChevronRight aria-hidden="true" size={18} strokeWidth={1.8} />
                </button>
              ) : null}
              {canHideControls ? (
                <button
                  className={styles.toolButton}
                  onClick={hideControls}
                  type="button"
                >
                  <EyeOff aria-hidden="true" size={18} strokeWidth={1.8} />
                  Hide controls
                </button>
              ) : null}
              <button
                className={styles.toolButton}
                disabled={fullscreenSupported === false}
                onClick={() => void toggleFullscreen()}
                type="button"
              >
                {isFullscreen ? (
                  <Minimize2 aria-hidden="true" size={18} strokeWidth={1.8} />
                ) : (
                  <Maximize2 aria-hidden="true" size={18} strokeWidth={1.8} />
                )}
                {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.srOnly} id={noticeId}>
        Use F for fullscreen, H to hide controls, and the arrow keys to change
        patterns when available. Moving the pointer restores hidden controls.
        {advanceOnSurfaceClick
          ? " Click the full-screen test surface to show the next pattern."
          : null}
      </p>

      {fullscreenSupported === false && !error ? (
        <p className={styles.inlineNotice}>
          <TriangleAlert aria-hidden="true" size={18} strokeWidth={1.8} />
          Fullscreen is not available in this browser. The test still works in
          the panel above.
        </p>
      ) : null}

      {error ? (
        <p className={styles.inlineNotice} data-error="true" role="alert">
          <TriangleAlert aria-hidden="true" size={18} strokeWidth={1.8} />
          {error}
        </p>
      ) : null}
    </>
  );
}
