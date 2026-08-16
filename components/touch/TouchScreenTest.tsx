"use client";

import {
  Download,
  Maximize2,
  Play,
  RotateCcw,
  SquareCheckBig,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { testStartEventName } from "@/lib/test-events";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createDelayedObjectUrlReleaser,
  createLeadingTrailingThrottle,
  type DelayedObjectUrlReleaser,
  type LeadingTrailingThrottle,
} from "@/lib/touch-screen-schedulers";
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
const DOWNLOAD_URL_REVOKE_DELAY_MS = 1_000;

const TOUCH_UI = {
  en: { noPath: "No touch path was recorded. Test again before judging the screen.", all: "Every grid cell received input in this pass.", connected: "A connected area of {count} cells stayed blank. Repeat the pass slowly to see whether it fails in the same place.", isolated: "The remaining blank cells are isolated. Repeat the edges and corners before treating them as a dead zone.", live: "Coverage {coverage} percent. {live} live touches. Peak {peak}.", unavailable: "Fullscreen is not available. The test still works here.", refused: "Fullscreen was refused. The test still works here.", cleared: "Grid cleared. Start another pass from the corners.", passed: "Screen test passed. Every grid cell responded in this pass.", noData: "No touch data recorded. Run the test again and drag across the grid.", closeFailed: "Fullscreen could not close. Use Exit fullscreen to view your result.", alertPassed: "Screen test passed. Every part of the screen responded, and no touch dead zone was found in this pass.", resized: "The test area changed size. Restart so every cell uses the same grid.", prepareFailed: "The image could not be prepared. Please try the download again.", downloadFailed: "The image could not be downloaded. Please try again.", touchDetected: "Touch input detected", mouseAvailable: "Mouse preview available on this device", mouseResult: "Desktop pointer preview", touchResult: "Touch input result", start: "Start Touch Test", restartNote: "Starting again clears the current map.", checker: "Touchscreen checker", coverage: "Coverage", liveTouches: "Live touches", peakTouches: "Peak touches", reset: "Reset", fullscreen: "Enter fullscreen", finish: "Finish", paintedMissed: "Painted and missed cells", paintedValue: "{painted} painted, {missed} missed", again: "Test Again", download: "Download Result" },
  zh: { noPath: "没有记录到触摸轨迹，请重新测试后再判断屏幕。", all: "本次测试中，每个网格都收到了输入。", connected: "有一片连续的 {count} 格保持空白。请慢速重复一次，确认是否仍在同一位置失效。", isolated: "剩余空白格彼此分散。先重测边缘和四角，再把它当作触控死区。", live: "覆盖率 {coverage}%。当前 {live} 个触点，峰值 {peak}。", unavailable: "这里无法使用全屏，测试仍可在当前区域运行。", refused: "浏览器拒绝了全屏，测试仍可在当前区域运行。", cleared: "网格已清空，请从四角开始再测一次。", passed: "测试通过：本次每个网格都响应了。", noData: "没有记录到触摸数据，请重新运行并划过网格。", closeFailed: "无法退出全屏，请使用“退出全屏”查看结果。", alertPassed: "测试通过：本次屏幕所有区域都已响应，没有发现触控死区。", resized: "测试区域尺寸发生变化。请重新开始，确保每格使用同一套网格。", prepareFailed: "无法生成结果图片，请重试下载。", downloadFailed: "无法下载图片，请重试。", touchDetected: "已检测到触摸输入", mouseAvailable: "当前设备可用鼠标预览", mouseResult: "桌面指针预览结果", touchResult: "触摸输入结果", start: "开始触摸测试", restartNote: "重新开始会清空当前网格。", checker: "触摸屏检测区域", coverage: "覆盖率", liveTouches: "当前触点", peakTouches: "峰值触点", reset: "重置", fullscreen: "进入全屏", finish: "完成", paintedMissed: "已覆盖与未覆盖网格", paintedValue: "已覆盖 {painted} 格，漏掉 {missed} 格", again: "再次测试", download: "下载结果" },
  de: { noPath: "Kein Touch-Pfad wurde aufgezeichnet. Teste erneut, bevor du das Display bewertest.", all: "Jedes Rasterfeld hat in diesem Durchgang eine Eingabe erhalten.", connected: "Ein zusammenhängender Bereich von {count} Feldern blieb leer. Wiederhole den Durchgang langsam an derselben Stelle.", isolated: "Die übrigen leeren Felder liegen vereinzelt. Wiederhole Ränder und Ecken, bevor du von einer toten Zone ausgehst.", live: "Abdeckung {coverage} Prozent. {live} aktive Kontakte. Spitze {peak}.", unavailable: "Vollbild ist hier nicht verfügbar. Der Test funktioniert weiterhin in diesem Bereich.", refused: "Der Browser hat Vollbild abgelehnt. Der Test funktioniert weiterhin hier.", cleared: "Raster geleert. Starte einen neuen Durchgang in den Ecken.", passed: "Test bestanden. Jedes Rasterfeld hat in diesem Durchgang reagiert.", noData: "Keine Touch-Daten aufgezeichnet. Starte erneut und ziehe durch das Raster.", closeFailed: "Vollbild konnte nicht beendet werden. Nutze Vollbild beenden, um das Ergebnis zu sehen.", alertPassed: "Test bestanden. Alle Bildschirmbereiche reagierten; in diesem Durchgang wurde keine tote Touch-Zone gefunden.", resized: "Der Testbereich hat seine Größe geändert. Starte neu, damit alle Felder dasselbe Raster verwenden.", prepareFailed: "Das Ergebnisbild konnte nicht vorbereitet werden. Versuche den Download erneut.", downloadFailed: "Das Bild konnte nicht heruntergeladen werden. Versuche es erneut.", touchDetected: "Touch-Eingabe erkannt", mouseAvailable: "Mausvorschau auf diesem Gerät verfügbar", mouseResult: "Desktop-Zeigervorschau", touchResult: "Touch-Ergebnis", start: "Touch-Test starten", restartNote: "Ein Neustart löscht die aktuelle Karte.", checker: "Touchscreen-Prüffläche", coverage: "Abdeckung", liveTouches: "Aktive Kontakte", peakTouches: "Maximale Kontakte", reset: "Zurücksetzen", fullscreen: "Vollbild starten", finish: "Beenden", paintedMissed: "Markierte und ausgelassene Felder", paintedValue: "{painted} markiert, {missed} ausgelassen", again: "Erneut testen", download: "Ergebnis herunterladen" },
} as const;

function resultInterpretation(summary: TouchGridSummary, locale: Locale): string {
  const copy = TOUCH_UI[locale];
  if (summary.paintedCells === 0) {
    return copy.noPath;
  }

  if (summary.largestMissedRegion === 0) {
    return copy.all;
  }

  if (summary.largestMissedRegion >= 4) {
    return copy.connected.replace("{count}", String(summary.largestMissedRegion));
  }

  return copy.isolated;
}

function localDateStamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function TouchScreenTest({ locale = "en" }: { locale?: Locale } = {}) {
  const copy = TOUCH_UI[locale];
  const hostRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<TouchGridCanvasHandle>(null);
  const liveRegionRef = useRef<HTMLParagraphElement>(null);
  const liveSummaryTimerRef = useRef<number | null>(null);
  const liveSummaryThrottleRef = useRef<LeadingTrailingThrottle<TouchGridSummary> | null>(null);
  const downloadUrlReleaserRef = useRef<DelayedObjectUrlReleaser | null>(null);
  const focusFrameRef = useRef<number | null>(null);
  const finishFocusPendingRef = useRef(false);
  const fullscreenOperationRef = useRef(0);
  const fullscreenAllowedRef = useRef(false);
  const wasFullscreenRef = useRef(false);
  const autoCompletionHandledRef = useRef(false);
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

  const focusBenchControl = useCallback(() => {
    cancelFocusFrame();
    focusFrameRef.current = requestAnimationFrame(() => {
      focusFrameRef.current = null;
      (resetButtonRef.current ?? hostRef.current)?.focus({ preventScroll: true });
    });
  }, [cancelFocusFrame]);

  const exitFullscreenIfStale = useCallback(
    async (host: HTMLDivElement) => {
      if (
        document.fullscreenElement === host &&
        !fullscreenAllowedRef.current
      ) {
        try {
          await document.exitFullscreen();
        } catch {
          // Stale fullscreen work must not replace the current session notice.
        }
      }
    },
    [],
  );

  useEffect(() => {
    setTouchCapable(navigator.maxTouchPoints > 0);

    const handleFullscreenChange = () => {
      const active = document.fullscreenElement === hostRef.current;
      const enteredOwnFullscreen = !wasFullscreenRef.current && active;
      const exitedOwnFullscreen = wasFullscreenRef.current && !active;
      wasFullscreenRef.current = active;
      setIsFullscreen(active);

      if (enteredOwnFullscreen) {
        focusBenchControl();
        return;
      }
      if (!exitedOwnFullscreen) return;
      fullscreenOperationRef.current += 1;
      fullscreenAllowedRef.current = false;
      if (phaseRef.current === "result") {
        finishFocusPendingRef.current = false;
        focusResultHeading();
        return;
      }
      if (finishFocusPendingRef.current) return;
      if (phaseRef.current === "active") focusStartButton();
    };

    handleFullscreenChange();
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      fullscreenOperationRef.current += 1;
      fullscreenAllowedRef.current = false;
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      cancelFocusFrame();
    };
  }, [cancelFocusFrame, focusBenchControl, focusResultHeading, focusStartButton]);

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
    const throttle = createLeadingTrailingThrottle<TouchGridSummary, number>(
      (latest) => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = copy.live
            .replace("{coverage}", String(latest.coveragePercent))
            .replace("{live}", String(latest.liveTouches))
            .replace("{peak}", String(latest.peakTouches));
        }
      },
      {
        intervalMs: LIVE_SUMMARY_DELAY_MS,
        now: Date.now,
        setTimer: (callback, delay) => window.setTimeout(callback, delay),
        clearTimer: (timer) => window.clearTimeout(timer),
        timerRef: liveSummaryTimerRef,
      },
    );
    liveSummaryThrottleRef.current = throttle;

    return () => {
      throttle.cancel();
      if (liveSummaryThrottleRef.current === throttle) {
        liveSummaryThrottleRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const releaser = createDelayedObjectUrlReleaser<number>({
      delayMs: DOWNLOAD_URL_REVOKE_DELAY_MS,
      setTimer: (callback, delay) => window.setTimeout(callback, delay),
      clearTimer: (timer) => window.clearTimeout(timer),
      revoke: (url) => URL.revokeObjectURL(url),
    });
    downloadUrlReleaserRef.current = releaser;

    return () => {
      releaser.dispose();
      if (downloadUrlReleaserRef.current === releaser) {
        downloadUrlReleaserRef.current = null;
      }
    };
  }, []);

  const handleSummary = useCallback((nextSummary: TouchGridSummary) => {
    setSummary(nextSummary);
    if (
      phaseRef.current === "active" &&
      (nextSummary.paintedCells > 0 || nextSummary.liveTouches > 0)
    ) {
      liveSummaryThrottleRef.current?.push(nextSummary);
    }
  }, []);

  const prepareSession = useCallback((requestFullscreen: boolean) => {
    fullscreenOperationRef.current += 1;
    fullscreenAllowedRef.current =
      requestFullscreen || document.fullscreenElement === hostRef.current;
    finishFocusPendingRef.current = false;
    cancelFocusFrame();
    liveSummaryThrottleRef.current?.cancel();
    setSessionKey((current) => current + 1);
    autoCompletionHandledRef.current = false;
    setSummary(EMPTY_SUMMARY);
    setDownloadError(null);
    phaseRef.current = "active";
    setPhase("active");
    return fullscreenOperationRef.current;
  }, [cancelFocusFrame]);

  const startTest = useCallback(async () => {
    const operationToken = prepareSession(true);
    setNotice(null);

    const host = hostRef.current;
    if (!host || !document.fullscreenEnabled || !host.requestFullscreen) {
      if (operationToken === fullscreenOperationRef.current) {
        setNotice(copy.unavailable);
      }
      return;
    }

    if (document.fullscreenElement === host) return;

    try {
      await host.requestFullscreen();
      if (operationToken !== fullscreenOperationRef.current) {
        await exitFullscreenIfStale(host);
      }
    } catch {
      if (
        operationToken === fullscreenOperationRef.current &&
        document.fullscreenElement !== host
      ) {
        setNotice(copy.refused);
      }
    }
  }, [exitFullscreenIfStale, prepareSession]);

  useEffect(() => {
    const startEvent = testStartEventName("touch-screen-test");
    const handleStartRequest = () => void startTest();
    window.addEventListener(startEvent, handleStartRequest);
    return () => window.removeEventListener(startEvent, handleStartRequest);
  }, [startTest]);

  const resetTest = useCallback(() => {
    prepareSession(false);
    setNotice(copy.cleared);
  }, [prepareSession]);

  const finishTest = useCallback(async (completedEveryCell = false) => {
    const finalSummary = canvasRef.current?.getSummary() ?? summary;
    fullscreenOperationRef.current += 1;
    const operationToken = fullscreenOperationRef.current;
    fullscreenAllowedRef.current = false;
    finishFocusPendingRef.current = true;
    liveSummaryThrottleRef.current?.cancel();
    setDownloadError(null);
    setSummary(finalSummary);
    phaseRef.current = "result";
    setPhase("result");
    setNotice(
      completedEveryCell
        ? copy.passed
        : finalSummary.paintedCells === 0
        ? copy.noData
        : null,
    );

    const host = hostRef.current;
    if (document.fullscreenElement !== host) return;

    try {
      await document.exitFullscreen();
    } catch {
      if (
        operationToken === fullscreenOperationRef.current &&
        finalSummary.paintedCells > 0
      ) {
        setNotice(copy.closeFailed);
      }
    }
  }, [summary]);

  useEffect(() => {
    if (
      phase !== "active" ||
      autoCompletionHandledRef.current ||
      summary.totalCells <= 0 ||
      summary.paintedCells < summary.totalCells
    ) {
      return;
    }

    autoCompletionHandledRef.current = true;
    window.alert(
      copy.alertPassed,
    );
    void finishTest(true);
  }, [finishTest, phase, summary.paintedCells, summary.totalCells]);

  const pauseForResize = useCallback(() => {
    if (phaseRef.current !== "active") return;

    phaseRef.current = "paused";
    liveSummaryThrottleRef.current?.cancel();
    setPhase("paused");
    setNotice(copy.resized);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const host = hostRef.current;
    if (!host || !document.fullscreenEnabled || !host.requestFullscreen) {
      setNotice(copy.unavailable);
      return;
    }

    fullscreenOperationRef.current += 1;
    const operationToken = fullscreenOperationRef.current;
    const enteringFullscreen = document.fullscreenElement !== host;
    fullscreenAllowedRef.current = enteringFullscreen;
    setNotice(null);

    try {
      if (enteringFullscreen) {
        await host.requestFullscreen();
        if (operationToken !== fullscreenOperationRef.current) {
          await exitFullscreenIfStale(host);
        }
      } else {
        await document.exitFullscreen();
      }
    } catch {
      if (operationToken === fullscreenOperationRef.current) {
        setNotice(copy.refused);
      }
    }
  }, [exitFullscreenIfStale]);

  const downloadResult = useCallback(async () => {
    setDownloadError(null);
    let anchor: HTMLAnchorElement | null = null;
    let objectUrl: string | null = null;

    try {
      const blob = await canvasRef.current?.exportResult(summary);
      if (!blob) {
        setDownloadError(copy.prepareFailed);
        return;
      }

      objectUrl = URL.createObjectURL(blob);
      anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `screentesthub-touch-result-${localDateStamp(new Date())}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      const releaser = downloadUrlReleaserRef.current;
      if (releaser) {
        releaser.releaseLater(objectUrl);
        objectUrl = null;
      }
    } catch {
      setDownloadError(copy.downloadFailed);
    } finally {
      anchor?.remove();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  }, [summary]);

  const capabilityNote =
    touchCapable === null
      ? null
      : touchCapable
        ? copy.touchDetected
        : copy.mouseAvailable;

  const resultTitle =
    summary.inputMode === "mouse"
      ? copy.mouseResult
      : copy.touchResult;

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
          {copy.start}
        </button>
        <div className={styles.startNotes}>
          {capabilityNote ? <span>{capabilityNote}</span> : null}
          {phase === "active" ? (
            <span>{copy.restartNote}</span>
          ) : null}
        </div>
      </div>

      <div
        aria-label={copy.checker}
        className={styles.bench}
        ref={hostRef}
        role="region"
        tabIndex={-1}
      >
        {!isFullscreen ? (
          <div className={styles.metricRail}>
            <div className={styles.metricCell}>
              <span>{copy.coverage}</span>
              <strong>{summary.coveragePercent}%</strong>
            </div>
            <div className={styles.metricCell}>
              <span>{copy.liveTouches}</span>
              <strong>{summary.liveTouches}</strong>
            </div>
            <div className={styles.metricCell}>
              <span>{copy.peakTouches}</span>
              <strong>{summary.peakTouches}</strong>
            </div>
          </div>
        ) : null}

        <p
          aria-atomic="true"
          aria-live="polite"
          className={styles.srOnly}
          ref={liveRegionRef}
        />

        <div className={styles.canvasFrame}>
          <TouchGridCanvas
            active={phase === "active"}
            frozen={phase === "paused" || phase === "result"}
            fullscreenExitEnabled={isFullscreen}
            locale={locale}
            onGeometryInvalidated={pauseForResize}
            onFullscreenExitRequest={() => void toggleFullscreen()}
            onSummary={handleSummary}
            ref={canvasRef}
            sessionKey={sessionKey}
          />
        </div>

        {!isFullscreen ? (
          <div className={styles.controlStack}>
            <button
              className={styles.quietButton}
              onClick={resetTest}
              ref={resetButtonRef}
              type="button"
            >
              <RotateCcw aria-hidden="true" size={18} strokeWidth={1.8} />
              {copy.reset}
            </button>
            <button
              className={styles.quietButton}
              onClick={() => void toggleFullscreen()}
              type="button"
            >
              <Maximize2 aria-hidden="true" size={18} strokeWidth={1.8} />
              {copy.fullscreen}
            </button>
            <button
              className={styles.quietButton}
              disabled={phase === "idle" || phase === "result"}
              onClick={() => void finishTest(false)}
              type="button"
            >
              <SquareCheckBig aria-hidden="true" size={18} strokeWidth={1.8} />
              {copy.finish}
            </button>
          </div>
        ) : null}
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
              <dt>{copy.coverage}</dt>
              <dd>{summary.coveragePercent}%</dd>
            </div>
            <div>
              <dt>{copy.paintedMissed}</dt>
              <dd>
                {copy.paintedValue.replace("{painted}", String(summary.paintedCells)).replace("{missed}", String(summary.missedCells))}
              </dd>
            </div>
            <div>
              <dt>{copy.peakTouches}</dt>
              <dd>{summary.peakTouches}</dd>
            </div>
          </dl>
          <p className={styles.interpretation}>{resultInterpretation(summary, locale)}</p>
          <div className={styles.resultActions}>
            <button
              className={styles.secondaryButton}
              onClick={() => void startTest()}
              type="button"
            >
              <RotateCcw aria-hidden="true" size={18} strokeWidth={1.8} />
              {copy.again}
            </button>
            <button
              className={styles.primaryButton}
              disabled={summary.paintedCells === 0}
              onClick={() => void downloadResult()}
              type="button"
            >
              <Download aria-hidden="true" size={18} strokeWidth={1.8} />
              {copy.download}
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
