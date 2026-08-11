"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  cellIndexAt,
  coverageResult,
  interpolateCellIndexes,
  nextPeakTouchCount,
  type GridPoint,
  type GridSize,
} from "@/lib/touch-grid";
import styles from "./TouchScreenTest.module.css";

export type TouchInputMode = "none" | "mouse" | "touch" | "pen";

export type TouchGridSummary = Readonly<{
  paintedCells: number;
  missedCells: number;
  totalCells: number;
  coveragePercent: number;
  largestMissedRegion: number;
  liveTouches: number;
  peakTouches: number;
  inputMode: TouchInputMode;
}>;

export type TouchGridCanvasHandle = Readonly<{
  exportResult: (summary: TouchGridSummary) => Promise<Blob | null>;
}>;

type TouchGridCanvasProps = Readonly<{
  active: boolean;
  frozen: boolean;
  sessionKey: number;
  onGeometryInvalidated: () => void;
  onSummary: (summary: TouchGridSummary) => void;
}>;

const GRID: GridSize = { columns: 24, rows: 16 };
const MAX_DEVICE_PIXEL_RATIO = 2;

function currentDevicePixelRatio(): number {
  const ratio = window.devicePixelRatio;
  return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
}

function cappedDevicePixelRatio(): number {
  return Math.min(
    MAX_DEVICE_PIXEL_RATIO,
    Math.max(1, currentDevicePixelRatio()),
  );
}

function inputModeFromPointerType(pointerType: string): TouchInputMode {
  if (pointerType === "touch" || pointerType === "pen" || pointerType === "mouse") {
    return pointerType;
  }

  return "none";
}

function isFinitePoint(point: GridPoint): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

function canvasColors(canvas: HTMLCanvasElement) {
  const colors = getComputedStyle(canvas);

  return {
    empty: colors.getPropertyValue("--touch-cell-empty").trim() || "#252724",
    filled: colors.getPropertyValue("--touch-cell-filled").trim() || "#a13d1d",
    line: colors.getPropertyValue("--touch-grid-line").trim() || "#6f716d",
    point: colors.getPropertyValue("--touch-point").trim() || "#fffaf4",
  };
}

export const TouchGridCanvas = forwardRef<
  TouchGridCanvasHandle,
  TouchGridCanvasProps
>(function TouchGridCanvas(
  { active, frozen, sessionKey, onGeometryInvalidated, onSummary },
  forwardedRef,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cssSizeRef = useRef({ width: 0, height: 0 });
  const paintedRef = useRef(new Set<number>());
  const pointersRef = useRef(new Map<number, GridPoint>());
  const previousPointsRef = useRef(new Map<number, GridPoint>());
  const peakRef = useRef(0);
  const inputModeRef = useRef<TouchInputMode>("none");
  const frameRef = useRef<number | null>(null);
  const resizeInitializedRef = useRef(false);
  const appliedDevicePixelRatioRef = useRef(1);
  const activeRef = useRef(active);
  const onGeometryInvalidatedRef = useRef(onGeometryInvalidated);
  const onSummaryRef = useRef(onSummary);

  activeRef.current = active;
  onGeometryInvalidatedRef.current = onGeometryInvalidated;
  onSummaryRef.current = onSummary;

  const clearPointerResources = useCallback(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      for (const pointerId of pointersRef.current.keys()) {
        try {
          if (canvas.hasPointerCapture(pointerId)) {
            canvas.releasePointerCapture(pointerId);
          }
        } catch {
          // Pointer capture can disappear between the check and release.
        }
      }
    }

    pointersRef.current.clear();
    previousPointsRef.current.clear();
  }, []);

  const applyDevicePixelRatio = useCallback(() => {
    const ratio = cappedDevicePixelRatio();
    const ratioChanged = appliedDevicePixelRatioRef.current !== ratio;
    appliedDevicePixelRatioRef.current = ratio;

    const canvas = canvasRef.current;
    const { width, height } = cssSizeRef.current;
    if (
      !canvas ||
      !Number.isFinite(width) ||
      !Number.isFinite(height) ||
      width <= 0 ||
      height <= 0
    ) {
      return ratioChanged;
    }

    const backingWidth = Math.max(1, Math.round(width * ratio));
    const backingHeight = Math.max(1, Math.round(height * ratio));
    const backingSizeChanged =
      canvas.width !== backingWidth || canvas.height !== backingHeight;

    if (canvas.width !== backingWidth) canvas.width = backingWidth;
    if (canvas.height !== backingHeight) canvas.height = backingHeight;

    return ratioChanged || backingSizeChanged;
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const { width, height } = cssSizeRef.current;
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return;
    }

    const ratio = appliedDevicePixelRatioRef.current;
    const { empty, filled, line, point } = canvasColors(canvas);
    const cellWidth = width / GRID.columns;
    const cellHeight = height / GRID.rows;

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    for (let index = 0; index < GRID.columns * GRID.rows; index += 1) {
      const column = index % GRID.columns;
      const row = Math.floor(index / GRID.columns);

      context.fillStyle = paintedRef.current.has(index) ? filled : empty;
      context.fillRect(
        column * cellWidth,
        row * cellHeight,
        cellWidth,
        cellHeight,
      );
      context.strokeStyle = line;
      context.lineWidth = 0.6;
      context.strokeRect(
        column * cellWidth,
        row * cellHeight,
        cellWidth,
        cellHeight,
      );
    }

    for (const activePoint of pointersRef.current.values()) {
      context.beginPath();
      context.arc(activePoint.x, activePoint.y, 11, 0, Math.PI * 2);
      context.fillStyle = point;
      context.fill();
      context.lineWidth = 2;
      context.strokeStyle = empty;
      context.stroke();
    }
  }, []);

  const emitSummary = useCallback(() => {
    const coverage = coverageResult(paintedRef.current, GRID);

    onSummaryRef.current({
      paintedCells: coverage.painted,
      missedCells: coverage.missed,
      totalCells: coverage.total,
      coveragePercent: coverage.percent,
      largestMissedRegion: coverage.largestMissedRegion,
      liveTouches: pointersRef.current.size,
      peakTouches: peakRef.current,
      inputMode: inputModeRef.current,
    });
  }, []);

  const scheduleFrame = useCallback(() => {
    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      render();
      emitSummary();
    });
  }, [emitSummary, render]);

  const pointFromEvent = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>): GridPoint => {
      const rect = event.currentTarget.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    },
    [],
  );

  const paintBetween = useCallback((from: GridPoint, to: GridPoint) => {
    const { width, height } = cssSizeRef.current;

    for (const index of interpolateCellIndexes(from, to, { width, height }, GRID)) {
      paintedRef.current.add(index);
    }
  }, []);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (!active || frozen) return;
      if (!Number.isFinite(event.pointerId)) return;

      const point = pointFromEvent(event);
      if (!isFinitePoint(point)) return;

      const index = cellIndexAt(point, cssSizeRef.current, GRID);
      if (index === null) return;

      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Painting still works when a browser declines pointer capture.
      }

      inputModeRef.current = inputModeFromPointerType(event.pointerType);
      pointersRef.current.set(event.pointerId, point);
      previousPointsRef.current.set(event.pointerId, point);
      peakRef.current = nextPeakTouchCount(
        peakRef.current,
        pointersRef.current.size,
      );
      paintedRef.current.add(index);
      scheduleFrame();
    },
    [active, frozen, pointFromEvent, scheduleFrame],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (!active || frozen) return;
      if (!pointersRef.current.has(event.pointerId)) return;

      const point = pointFromEvent(event);
      const previousPoint = previousPointsRef.current.get(event.pointerId);
      if (!previousPoint || !isFinitePoint(point)) return;

      paintBetween(previousPoint, point);
      pointersRef.current.set(event.pointerId, point);
      previousPointsRef.current.set(event.pointerId, point);
      scheduleFrame();
    },
    [active, frozen, paintBetween, pointFromEvent, scheduleFrame],
  );

  const releasePointer = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (!active || frozen) return;
      if (!pointersRef.current.has(event.pointerId)) return;

      pointersRef.current.delete(event.pointerId);
      previousPointsRef.current.delete(event.pointerId);

      try {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      } catch {
        // The browser may already have released this pointer.
      }

      scheduleFrame();
    },
    [active, frozen, scheduleFrame],
  );

  const exportResult = useCallback(
    async (summary: TouchGridSummary): Promise<Blob | null> => {
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = 1400;
      exportCanvas.height = 1000;

      const context = exportCanvas.getContext("2d");
      if (!context) return null;

      const sourceCanvas = canvasRef.current;
      const colors = sourceCanvas
        ? canvasColors(sourceCanvas)
        : {
            empty: "#252724",
            filled: "#a13d1d",
            line: "#6f716d",
            point: "#fffaf4",
          };
      const gridLeft = 70;
      const gridTop = 190;
      const gridWidth = 1260;
      const gridHeight = 630;
      const cellWidth = gridWidth / GRID.columns;
      const cellHeight = gridHeight / GRID.rows;

      context.fillStyle = "#e8e5dc";
      context.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      context.fillStyle = "#171916";
      context.fillRect(0, 0, exportCanvas.width, 150);
      context.fillStyle = "#fffaf4";
      context.font = "700 38px system-ui, sans-serif";
      context.fillText("ScreenTestHub Touch Screen Test", 70, 72);
      context.font = "20px ui-monospace, monospace";
      context.fillStyle = "#c9ccc5";
      context.fillText(`Test date: ${new Date().toLocaleString()}`, 70, 112);

      for (let index = 0; index < GRID.columns * GRID.rows; index += 1) {
        const column = index % GRID.columns;
        const row = Math.floor(index / GRID.columns);

        context.fillStyle = paintedRef.current.has(index)
          ? colors.filled
          : colors.empty;
        context.fillRect(
          gridLeft + column * cellWidth,
          gridTop + row * cellHeight,
          cellWidth,
          cellHeight,
        );
        context.strokeStyle = colors.line;
        context.lineWidth = 1;
        context.strokeRect(
          gridLeft + column * cellWidth,
          gridTop + row * cellHeight,
          cellWidth,
          cellHeight,
        );
      }

      context.fillStyle = "#171916";
      context.font = "700 25px system-ui, sans-serif";
      context.fillText(`Coverage: ${summary.coveragePercent}%`, 70, 888);
      context.fillText(`Missed cells: ${summary.missedCells}`, 400, 888);
      context.fillText(
        `Largest missed region: ${summary.largestMissedRegion}`,
        700,
        888,
      );
      context.fillText(`Peak touches: ${summary.peakTouches}`, 70, 946);

      if (typeof exportCanvas.toBlob !== "function") return null;

      return new Promise((resolve) => {
        try {
          exportCanvas.toBlob((blob) => resolve(blob), "image/png");
        } catch {
          resolve(null);
        }
      });
    },
    [],
  );

  useImperativeHandle(
    forwardedRef,
    () => ({ exportResult }),
    [exportResult],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        return;
      }

      const previousSize = cssSizeRef.current;
      const changed =
        !resizeInitializedRef.current ||
        previousSize.width !== width ||
        previousSize.height !== height;
      if (!changed) return;

      clearPointerResources();
      cssSizeRef.current = { width, height };

      applyDevicePixelRatio();

      if (
        resizeInitializedRef.current &&
        activeRef.current &&
        paintedRef.current.size > 0
      ) {
        onGeometryInvalidatedRef.current();
      }

      resizeInitializedRef.current = true;
      scheduleFrame();
    });

    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, [applyDevicePixelRatio, clearPointerResources, scheduleFrame]);

  useEffect(() => {
    let resolutionQuery: MediaQueryList | null = null;
    let observedRatio: number | null = null;

    function syncDevicePixelRatio() {
      if (applyDevicePixelRatio()) scheduleFrame();
    }

    function handleResolutionChange() {
      syncDevicePixelRatio();
      registerResolutionListener(true);
    }

    function registerResolutionListener(force = false) {
      if (typeof window.matchMedia !== "function") return;

      const ratio = currentDevicePixelRatio();
      if (!force && resolutionQuery && observedRatio === ratio) return;

      if (resolutionQuery) {
        resolutionQuery.removeEventListener("change", handleResolutionChange);
      }

      observedRatio = ratio;
      resolutionQuery = window.matchMedia(`(resolution: ${ratio}dppx)`);
      resolutionQuery.addEventListener("change", handleResolutionChange);
    }

    function handleWindowResize() {
      syncDevicePixelRatio();
      registerResolutionListener();
    }

    syncDevicePixelRatio();
    registerResolutionListener();
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      if (resolutionQuery) {
        resolutionQuery.removeEventListener("change", handleResolutionChange);
      }
    };
  }, [applyDevicePixelRatio, scheduleFrame]);

  useEffect(() => {
    if (active && !frozen) return;

    clearPointerResources();
    scheduleFrame();
  }, [active, clearPointerResources, frozen, scheduleFrame]);

  useEffect(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    clearPointerResources();
    paintedRef.current.clear();
    peakRef.current = 0;
    inputModeRef.current = "none";
    scheduleFrame();
  }, [clearPointerResources, scheduleFrame, sessionKey]);

  useEffect(() => {
    const clearActivePointers = () => {
      if (pointersRef.current.size === 0) return;

      clearPointerResources();
      scheduleFrame();
    };
    const handleVisibilityChange = () => {
      if (document.hidden) clearActivePointers();
    };

    window.addEventListener("blur", clearActivePointers);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", clearActivePointers);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [clearPointerResources, scheduleFrame]);

  useEffect(
    () => () => {
      clearPointerResources();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    },
    [clearPointerResources],
  );

  const canvasLabel = frozen
    ? "Touchscreen coverage result. Input is frozen."
    : active
      ? "Interactive touchscreen coverage grid"
      : "Touchscreen coverage grid. Input is disabled.";

  return (
    <canvas
      aria-disabled={!active || frozen}
      aria-label={canvasLabel}
      className={styles.touchCanvas}
      data-active={active}
      onLostPointerCapture={releasePointer}
      onPointerCancel={releasePointer}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={releasePointer}
      ref={canvasRef}
      role="img"
    />
  );
});
