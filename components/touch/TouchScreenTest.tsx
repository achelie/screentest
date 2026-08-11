"use client";

import {
  Download,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  SquareCheckBig,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  TouchGridCanvas,
  type TouchGridCanvasHandle,
  type TouchGridSummary,
} from "./TouchGridCanvas";
import styles from "./TouchScreenTest.module.css";

type Phase = "idle" | "active" | "paused" | "result";

const EMPTY_SUMMARY: TouchGridSummary = {
  paintedCells: 0,
  missedCells: 384,
  totalCells: 384,
  coveragePercent: 0,
  largestMissedRegion: 384,
  liveTouches: 0,
  peakTouches: 0,
  inputMode: "none",
};

const LIVE_SUMMARY_DELAY_MS = 600;

function resultInterpretation(summary: TouchGridSummary): string {
  if (summary.paintedCells === 0) {
    return "No touch path was recorded. Test again before judging the screen.";
  }

  if (summary.largestMissedRegion === 0) {
    return "Every grid cell received input in this pass.";
  }

  if (summary.largestMissedRegion >= 4) {
    return `A connected area of ${summary.largestMissedRegion} cells stayed blank. Repeat the pass slowly to see whether it fails in the same place.`;
  }

  return "The remaining blank cells are isolated. Repeat the edges and corners before treating them as a dead zone.";
}

function localDateStamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function TouchScreenTest() {
  const hostRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<TouchGridCanvasHandle>(null);
  const liveRegionRef = useRef<HTMLParagraphElement>(null);
  const liveSummaryTimerRef = useRef<number | null>(null);
  const pendingSummaryRef = useRef<TouchGridSummary>(EMPTY_SUMMARY);
  const focusFrameRef = useRef<number | null>(null);
  const finishFocusPendingRef = useRef(false);
  const wasFullscreenRef = useRef(false);
  const phaseRef = useRef<Phase>("idle");

  const [phase, setPhase] = useState<Phase>("idle");
  const [sessionKey, setSessionKey] = useState(0);
  const [summary, setSummary] = useState<TouchGridSummary>(EMPTY_SUMMARY);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchCapable, setTouchCapable] = useState<boolean | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  phaseRef.current = phase;

  const cancelFocusFrame = useCallback(() => {
    if (focusFrameRef.current !== null) {
      cancelAnimationFrame(focusFrameRef.current);
      focusFrameRef.current = null;
    }
  }, []);

  const focusResultHeading = useCallback(() => {
    cancelFocusFrame();
    focusFrameRef.current = requestAnimationFrame(() => {
      focusFrameRef.current = null;
      const heading = resultHeadingRef.current;
      if (!heading) return;

      heading.focus({ preventScroll: true });
      finishFocusPendingRef.current = false;
    });
  }, [cancelFocusFrame]);

  const focusStartButton = useCallback(() => {
    cancelFocusFrame();
    focusFrameRef.current = requestAnimationFrame(() => {
      focusFrameRef.current = null;
      startButtonRef.current?.focus({ preventScroll: true });
    });
  }, [cancelFocusFrame]);

  useEffect(() => {
    setTouchCapable(navigator.maxTouchPoints > 0);

    const handleFullscreenChange = () => {
      const active = document.fullscreenElement === hostRef.current;
      const exitedOwnFullscreen = wasFullscreenRef.current && !active;
      wasFullscreenRef.current = active;
      setIsFullscreen(active);

      if (!exitedOwnFullscreen || finishFocusPendingRef.current) return;
      if (phaseRef.current === "active") focusStartButton();
    };

    handleFullscreenChange();
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      cancelFocusFrame();
    };
  }, [cancelFocusFrame, focusStartButton]);

  useEffect(() => {
    if (
      phase !== "result" ||
      !finishFocusPendingRef.current ||
      document.fullscreenElement === hostRef.current
    ) {
      return;
    }

    focusResultHeading();
  }, [focusResultHeading, isFullscreen, phase]);

  useEffect(() => {
    pendingSummaryRef.current = summary;
    if (liveSummaryTimerRef.current !== null) return;

    liveSummaryTimerRef.current = window.setTimeout(() => {
      liveSummaryTimerRef.current = null;
      const latest = pendingSummaryRef.current;
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent =
          `Coverage ${latest.coveragePercent} percent. ` +
          `${latest.liveTouches} live touches. Peak ${latest.peakTouches}.`;
      }
    }, LIVE_SUMMARY_DELAY_MS);
  }, [summary]);

  useEffect(
    () => () => {
      if (liveSummaryTimerRef.current !== null) {
        window.clearTimeout(liveSummaryTimerRef.current);
      }
    },
    [],
  );

  const prepareSession = useCallback(() => {
    finishFocusPendingRef.current = false;
    cancelFocusFrame();
    setSessionKey((current) => current + 1);
    setSummary(EMPTY_SUMMARY);
    setDownloadError(null);
    setPhase("active");
  }, [cancelFocusFrame]);

  const startTest = useCallback(async () => {
    prepareSession();
    setNotice(null);

    const host = hostRef.current;
    if (!host || !document.fullscreenEnabled || !host.requestFullscreen) {
      setNotice("Fullscreen is not available. The test still works here.");
      return;
    }

    if (document.fullscreenElement === host) return;

    try {
      await host.requestFullscreen();
    } catch {
      setNotice("Fullscreen was refused. The test still works here.");
    }
  }, [prepareSession]);

  const resetTest = useCallback(() => {
    prepareSession();
    setNotice("Grid cleared. Start another pass from the corners.");
  }, [prepareSession]);

  const finishTest = useCallback(async () => {
    finishFocusPendingRef.current = true;
    setDownloadError(null);
    setPhase("result");
    setNotice(
      summary.paintedCells === 0
        ? "No touch data recorded. Run the test again and drag across the grid."
        : null,
    );

    const host = hostRef.current;
    if (document.fullscreenElement !== host) return;

    try {
      await document.exitFullscreen();
    } catch {
      if (summary.paintedCells > 0) {
        setNotice("Fullscreen could not close. Use Exit fullscreen to view your result.");
      }
    }
  }, [summary]);

  const pauseForResize = useCallback(() => {
    if (phaseRef.current !== "active") return;

    setPhase("paused");
    setNotice("The test area changed size. Restart so every cell uses the same grid.");
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const host = hostRef.current;
    if (!host || !document.fullscreenEnabled || !host.requestFullscreen) {
      setNotice("Fullscreen is not available. The test still works here.");
      return;
    }

    setNotice(null);

    try {
      if (document.fullscreenElement === host) {
        await document.exitFullscreen();
      } else {
        await host.requestFullscreen();
      }
    } catch {
      setNotice("Fullscreen was refused. The test still works here.");
    }
  }, []);

  const downloadResult = useCallback(async () => {
    setDownloadError(null);
    let anchor: HTMLAnchorElement | null = null;
    let objectUrl: string | null = null;

    try {
      const blob = await canvasRef.current?.exportResult(summary);
      if (!blob) {
        setDownloadError("The image could not be prepared. Please try the download again.");
        return;
      }

      objectUrl = URL.createObjectURL(blob);
      anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `screentesthub-touch-result-${localDateStamp(new Date())}.png`;
      document.body.appendChild(anchor);
      anchor.click();
    } catch {
      setDownloadError("The image could not be downloaded. Please try again.");
    } finally {
      anchor?.remove();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  }, [summary]);

  const capabilityNote =
    touchCapable === null
      ? null
      : touchCapable
        ? "Touch input detected"
        : "Mouse preview available on this device";

  const resultTitle =
    summary.inputMode === "mouse"
      ? "Desktop pointer preview"
      : "Touch input result";

  return (
    <section className={styles.controller}>
      <div className={styles.startRow}>
        <button
          className={styles.primaryButton}
          onClick={() => void startTest()}
          ref={startButtonRef}
          type="button"
        >
          <Play aria-hidden="true" size={18} strokeWidth={1.8} />
          Start Touch Test
        </button>
        <div className={styles.startNotes}>
          {capabilityNote ? <span>{capabilityNote}</span> : null}
          {phase === "active" ? (
            <span>Starting again clears the current map.</span>
          ) : null}
        </div>
      </div>

      <div
        aria-label="Touchscreen checker"
        className={styles.bench}
        ref={hostRef}
      >
        <div className={styles.metricRail}>
          <div className={styles.metricCell}>
            <span>Coverage</span>
            <strong>{summary.coveragePercent}%</strong>
          </div>
          <div className={styles.metricCell}>
            <span>Live touches</span>
            <strong>{summary.liveTouches}</strong>
          </div>
          <div className={styles.metricCell}>
            <span>Peak touches</span>
            <strong>{summary.peakTouches}</strong>
          </div>
          <p
            aria-atomic="true"
            aria-live="polite"
            className={styles.srOnly}
            ref={liveRegionRef}
          />
        </div>

        <div className={styles.canvasFrame}>
          <TouchGridCanvas
            active={phase === "active"}
            frozen={phase === "paused" || phase === "result"}
            onGeometryInvalidated={pauseForResize}
            onSummary={setSummary}
            ref={canvasRef}
            sessionKey={sessionKey}
          />
        </div>

        <div className={styles.controlStack}>
          <button
            className={styles.quietButton}
            onClick={resetTest}
            type="button"
          >
            <RotateCcw aria-hidden="true" size={18} strokeWidth={1.8} />
            Reset
          </button>
          <button
            className={styles.quietButton}
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
          <button
            className={styles.quietButton}
            disabled={phase === "idle" || phase === "result"}
            onClick={() => void finishTest()}
            type="button"
          >
            <SquareCheckBig aria-hidden="true" size={18} strokeWidth={1.8} />
            Finish
          </button>
        </div>
      </div>

      {notice ? (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      ) : null}

      {phase === "result" ? (
        <section className={styles.resultPanel} aria-labelledby="touch-result-title">
          <h2 id="touch-result-title" ref={resultHeadingRef} tabIndex={-1}>
            {resultTitle}
          </h2>
          <dl className={styles.resultMetrics}>
            <div>
              <dt>Coverage</dt>
              <dd>{summary.coveragePercent}%</dd>
            </div>
            <div>
              <dt>Painted and missed cells</dt>
              <dd>
                {summary.paintedCells} painted, {summary.missedCells} missed
              </dd>
            </div>
            <div>
              <dt>Peak touches</dt>
              <dd>{summary.peakTouches}</dd>
            </div>
          </dl>
          <p className={styles.interpretation}>{resultInterpretation(summary)}</p>
          <div className={styles.resultActions}>
            <button
              className={styles.secondaryButton}
              onClick={() => void startTest()}
              type="button"
            >
              <RotateCcw aria-hidden="true" size={18} strokeWidth={1.8} />
              Test Again
            </button>
            <button
              className={styles.primaryButton}
              disabled={summary.paintedCells === 0}
              onClick={() => void downloadResult()}
              type="button"
            >
              <Download aria-hidden="true" size={18} strokeWidth={1.8} />
              Download Result
            </button>
          </div>
          {downloadError ? (
            <p className={styles.downloadError} role="alert">
              {downloadError}
            </p>
          ) : null}
        </section>
      ) : null}
    </section>
  );
}
