# Touch Screen Test Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static-first `/touch-screen-test/` page with a canvas grid for dead-zone coverage, live multi-touch counting, local PNG results, researched FAQ content, and full site discovery.

**Architecture:** Keep SEO copy, metadata, links, and structured data in a Server Component. Hydrate only a focused client-side diagnostic bench. Put grid geometry and interpolation in a pure module with Node tests; keep pointer capture and canvas drawing in a canvas leaf; keep session, fullscreen, result, focus, and download behavior in a parent client component.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, CSS Modules with existing Tailwind v4 tokens, Lucide Icons, Canvas 2D, Pointer Events, Node 22 test runner, OpenNext for Cloudflare Workers.

---

## File Map

| Path | Responsibility |
| --- | --- |
| `lib/touch-grid.ts` | Pure cell mapping, swipe interpolation, coverage, and peak-touch helpers |
| `lib/touch-grid.test.mjs` | Node unit tests for the pure helpers |
| `components/touch/TouchGridCanvas.tsx` | Canvas sizing, rendering, pointer lifecycle, coverage recording, and export image generation |
| `components/touch/TouchScreenTest.tsx` | Idle, active, paused, and result states; fullscreen; controls; focus; download |
| `components/touch/TouchScreenTest.module.css` | Diagnostic bench layout, canvas, metrics, content sections, both themes, and mobile behavior |
| `app/touch-screen-test/page.tsx` | Static page copy, metadata, FAQ, related tools, and JSON-LD |
| `lib/site.ts` | Tools menu and sitemap route registration |
| `components/site/site-navigation.tsx` | Correct active-state detection for the top-level touch-test route |
| `package.json` | `test` script for pure helper tests |

The new route stays outside `lib/tests.ts` because it is a phone and touchscreen utility with its own content model, not another slug rendered by `app/tests/[slug]/page.tsx`.

---

### Task 1: Build and Test the Pure Touch-Grid Model

**Files:**
- Create: `lib/touch-grid.test.mjs`
- Create: `lib/touch-grid.ts`
- Modify: `package.json`

- [ ] **Step 1: Add the failing geometry and result tests**

Create `lib/touch-grid.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";

import {
  cellIndexAt,
  coverageResult,
  interpolateCellIndexes,
  largestMissedRegion,
  nextPeakTouchCount,
} from "./touch-grid.ts";

const grid = { columns: 10, rows: 8 };

test("maps coordinates to stable cell indexes and includes the far edge", () => {
  assert.equal(cellIndexAt({ x: 0, y: 0 }, 100, 80, grid), 0);
  assert.equal(cellIndexAt({ x: 99.9, y: 79.9 }, 100, 80, grid), 79);
  assert.equal(cellIndexAt({ x: 100, y: 80 }, 100, 80, grid), 79);
  assert.equal(cellIndexAt({ x: -0.1, y: 40 }, 100, 80, grid), null);
  assert.equal(cellIndexAt({ x: 101, y: 40 }, 100, 80, grid), null);
});

test("interpolates a fast horizontal swipe through every crossed cell", () => {
  assert.deepEqual(
    interpolateCellIndexes(
      { x: 5, y: 5 },
      { x: 95, y: 5 },
      100,
      80,
      grid,
    ),
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
});

test("deduplicates cells while preserving swipe order", () => {
  assert.deepEqual(
    interpolateCellIndexes(
      { x: 5, y: 5 },
      { x: 25, y: 25 },
      100,
      80,
      grid,
    ),
    [0, 11, 22],
  );
});

test("returns an exact coverage summary", () => {
  assert.deepEqual(coverageResult(new Set([0, 1, 2]), { columns: 2, rows: 2 }), {
    paintedCells: 3,
    missedCells: 1,
    totalCells: 4,
    coveragePercent: 75,
    largestMissedRegion: 1,
  });
});

test("finds the largest edge-connected group of missed cells", () => {
  assert.equal(largestMissedRegion(new Set([0, 1, 2]), { columns: 3, rows: 2 }), 3);
  assert.equal(largestMissedRegion(new Set([0, 1, 2, 3, 4, 5]), { columns: 3, rows: 2 }), 0);
});

test("keeps the largest simultaneous pointer count", () => {
  assert.equal(nextPeakTouchCount(2, 1), 2);
  assert.equal(nextPeakTouchCount(2, 4), 4);
});
```

- [ ] **Step 2: Add the test script**

Add this key to `package.json` under `scripts`:

```json
"test": "node --test lib/touch-grid.test.mjs"
```

- [ ] **Step 3: Run the test to prove the helper is missing**

Run:

```powershell
npm test
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `lib/touch-grid.ts`.

- [ ] **Step 4: Implement the minimum pure model**

Create `lib/touch-grid.ts`:

```ts
export type GridPoint = Readonly<{ x: number; y: number }>;
export type GridSize = Readonly<{ columns: number; rows: number }>;

export type CoverageResult = Readonly<{
  paintedCells: number;
  missedCells: number;
  totalCells: number;
  coveragePercent: number;
  largestMissedRegion: number;
}>;

function validSurface(width: number, height: number, grid: GridSize) {
  return width > 0 && height > 0 && grid.columns > 0 && grid.rows > 0;
}

export function cellIndexAt(
  point: GridPoint,
  width: number,
  height: number,
  grid: GridSize,
): number | null {
  if (
    !validSurface(width, height, grid) ||
    point.x < 0 ||
    point.y < 0 ||
    point.x > width ||
    point.y > height
  ) {
    return null;
  }

  const column = Math.min(
    grid.columns - 1,
    Math.floor((point.x / width) * grid.columns),
  );
  const row = Math.min(
    grid.rows - 1,
    Math.floor((point.y / height) * grid.rows),
  );

  return row * grid.columns + column;
}

export function interpolateCellIndexes(
  from: GridPoint,
  to: GridPoint,
  width: number,
  height: number,
  grid: GridSize,
): number[] {
  if (!validSurface(width, height, grid)) return [];

  const cellWidth = width / grid.columns;
  const cellHeight = height / grid.rows;
  const maxStep = Math.min(cellWidth, cellHeight) / 2;
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const steps = Math.max(1, Math.ceil(distance / maxStep));
  const indexes: number[] = [];
  const seen = new Set<number>();

  for (let step = 0; step <= steps; step += 1) {
    const progress = step / steps;
    const index = cellIndexAt(
      {
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress,
      },
      width,
      height,
      grid,
    );

    if (index !== null && !seen.has(index)) {
      seen.add(index);
      indexes.push(index);
    }
  }

  return indexes;
}

export function coverageResult(
  paintedCells: ReadonlySet<number>,
  grid: GridSize,
): CoverageResult {
  const totalCells = grid.columns * grid.rows;
  const paintedCount = Math.min(totalCells, paintedCells.size);

  return {
    paintedCells: paintedCount,
    missedCells: Math.max(0, totalCells - paintedCount),
    totalCells,
    coveragePercent:
      totalCells === 0 ? 0 : Math.round((paintedCount / totalCells) * 1000) / 10,
    largestMissedRegion: largestMissedRegion(paintedCells, grid),
  };
}

export function largestMissedRegion(
  paintedCells: ReadonlySet<number>,
  grid: GridSize,
) {
  const totalCells = grid.columns * grid.rows;
  const visited = new Set<number>();
  let largest = 0;

  for (let start = 0; start < totalCells; start += 1) {
    if (paintedCells.has(start) || visited.has(start)) continue;

    const stack = [start];
    let regionSize = 0;

    while (stack.length > 0) {
      const index = stack.pop();
      if (index === undefined || visited.has(index) || paintedCells.has(index)) continue;

      visited.add(index);
      regionSize += 1;
      const column = index % grid.columns;
      const row = Math.floor(index / grid.columns);
      const neighbors = [
        column > 0 ? index - 1 : -1,
        column < grid.columns - 1 ? index + 1 : -1,
        row > 0 ? index - grid.columns : -1,
        row < grid.rows - 1 ? index + grid.columns : -1,
      ];

      for (const neighbor of neighbors) {
        if (neighbor >= 0 && !visited.has(neighbor) && !paintedCells.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }

    largest = Math.max(largest, regionSize);
  }

  return largest;
}

export function nextPeakTouchCount(currentPeak: number, activeCount: number) {
  return Math.max(currentPeak, activeCount);
}
```

- [ ] **Step 5: Run tests and type checking**

Run:

```powershell
npm test
npm run typecheck
```

Expected: 6 tests PASS and TypeScript exits with code 0.

- [ ] **Step 6: Commit the model**

```powershell
git add package.json lib/touch-grid.ts lib/touch-grid.test.mjs
git commit -m "Add tested touch grid model"
```

---

### Task 2: Implement the Pointer and Canvas Leaf

**Files:**
- Create: `components/touch/TouchGridCanvas.tsx`
- Create: `components/touch/TouchScreenTest.module.css`

- [ ] **Step 1: Define the canvas contract and state containers**

Create `components/touch/TouchGridCanvas.tsx` with these exported contracts:

```tsx
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
```

Inside the component, use refs for the canvas, its CSS size, the painted-cell `Set`, active-pointer `Map`, previous-point `Map`, peak count, input mode, pending animation frame, and whether the first valid resize has already happened. Do not use React state for per-pointer coordinates.

- [ ] **Step 2: Implement rendering and throttled summaries**

Use one `requestAnimationFrame` entry point for both canvas redraws and `onSummary`:

```tsx
const render = useCallback(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const { width, height } = cssSizeRef.current;
  const ratio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);

  const cellWidth = width / GRID.columns;
  const cellHeight = height / GRID.rows;
  const colors = getComputedStyle(canvas);
  const empty = colors.getPropertyValue("--touch-cell-empty").trim() || "#252724";
  const filled = colors.getPropertyValue("--touch-cell-filled").trim() || "#a13d1d";
  const line = colors.getPropertyValue("--touch-grid-line").trim() || "#6f716d";
  const point = colors.getPropertyValue("--touch-point").trim() || "#fffaf4";

  for (let index = 0; index < GRID.columns * GRID.rows; index += 1) {
    const column = index % GRID.columns;
    const row = Math.floor(index / GRID.columns);
    context.fillStyle = paintedRef.current.has(index) ? filled : empty;
    context.fillRect(column * cellWidth, row * cellHeight, cellWidth, cellHeight);
    context.strokeStyle = line;
    context.lineWidth = 0.6;
    context.strokeRect(column * cellWidth, row * cellHeight, cellWidth, cellHeight);
  }

  context.fillStyle = point;
  for (const activePoint of pointersRef.current.values()) {
    context.beginPath();
    context.arc(activePoint.x, activePoint.y, 11, 0, Math.PI * 2);
    context.fill();
  }
}, []);

const emitSummary = useCallback(() => {
  const coverage = coverageResult(paintedRef.current, GRID);
  onSummary({
    ...coverage,
    liveTouches: pointersRef.current.size,
    peakTouches: peakRef.current,
    inputMode: inputModeRef.current,
  });
}, [onSummary]);

const scheduleFrame = useCallback(() => {
  if (frameRef.current !== null) return;
  frameRef.current = requestAnimationFrame(() => {
    frameRef.current = null;
    render();
    emitSummary();
  });
}, [emitSummary, render]);
```

- [ ] **Step 3: Implement pointer capture and swipe interpolation**

Convert each event through the canvas bounding rectangle. On `pointerdown`, capture the pointer, record its type, add it to both pointer maps, update the peak, paint the initial cell, and schedule one frame. On `pointermove`, ignore unknown pointer IDs, interpolate from the stored point, add every returned cell index, update the maps, and schedule one frame. On `pointerup`, `pointercancel`, and `lostpointercapture`, remove only that pointer and schedule one frame.

Use this shared painting code:

```tsx
const pointFromEvent = (event: ReactPointerEvent<HTMLCanvasElement>): GridPoint => {
  const rect = event.currentTarget.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
};

const paintBetween = (from: GridPoint, to: GridPoint) => {
  const { width, height } = cssSizeRef.current;
  for (const index of interpolateCellIndexes(from, to, width, height, GRID)) {
    paintedRef.current.add(index);
  }
};
```

The canvas JSX must be:

```tsx
<canvas
  aria-label="Interactive touchscreen coverage grid"
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
```

Guard every handler with `if (!active || frozen) return`. Set `touch-action: none` only through `[data-active="true"]` in CSS.

- [ ] **Step 4: Implement resize, reset, visibility cleanup, and PNG export**

`ResizeObserver` must size the backing store to the measured CSS size times a DPR capped at 2. The first measurement initializes the canvas. A later size change calls `onGeometryInvalidated()` only when the session is active and at least one cell has been painted; this lets the initial fullscreen transition settle before collecting data. Every resize clears active pointers. A `visibilitychange` or window `blur` clears pointers without deleting coverage.

When `sessionKey` changes, clear cells, pointers, previous points, peak, and input mode, then redraw and emit a zero summary.

Expose `exportResult` with `useImperativeHandle`. It must create a separate 1400 by 1000 canvas, draw a dark header with `ScreenTestHub Touch Screen Test`, render the current grid below it, and add coverage, missed cells, peak touches, and `new Date().toLocaleString()` as text. Resolve with `canvas.toBlob` using `image/png`; return `null` when no 2D context or blob is available.

- [ ] **Step 5: Add the canvas foundation styles**

Create `components/touch/TouchScreenTest.module.css` with the initial canvas rules:

```css
.canvasFrame {
  position: relative;
  min-width: 0;
  min-height: 28rem;
  overflow: hidden;
  border: 1px solid var(--line-strong);
  background: #171916;
}

.touchCanvas {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 28rem;
  --touch-cell-empty: #242622;
  --touch-cell-filled: var(--accent);
  --touch-grid-line: #666b64;
  --touch-point: var(--on-accent);
  cursor: crosshair;
}

.touchCanvas[data-active="true"] {
  touch-action: none;
}

@media (max-width: 48rem) {
  .canvasFrame,
  .touchCanvas {
    min-height: min(58dvh, 34rem);
  }
}
```

The flat canvas colors are a functional exception to the marketing-background texture rule because texture would create false visual signals.

- [ ] **Step 6: Verify and commit the canvas leaf**

Run:

```powershell
npm test
npm run typecheck
```

Expected: all helper tests PASS and TypeScript exits with code 0.

Commit:

```powershell
git add components/touch/TouchGridCanvas.tsx components/touch/TouchScreenTest.module.css
git commit -m "Add touch grid canvas interaction"
```

---

### Task 3: Build the Diagnostic Bench Session Controller

**Files:**
- Create: `components/touch/TouchScreenTest.tsx`
- Modify: `components/touch/TouchScreenTest.module.css`

- [ ] **Step 1: Add the session state machine and stable summary**

Create `components/touch/TouchScreenTest.tsx` with:

```tsx
"use client";

import {
  Download,
  Maximize2,
  Minimize2,
  RotateCcw,
  Square,
  TriangleAlert,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

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

export function TouchScreenTest() {
  const hostRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<TouchGridCanvasHandle>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [sessionKey, setSessionKey] = useState(0);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchCapable, setTouchCapable] = useState<boolean | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
```

On mount, set `touchCapable` from `navigator.maxTouchPoints > 0`. Listen to `fullscreenchange` once and keep `isFullscreen` synchronized. When fullscreen ends during an active session, return focus to `startRef` unless Finish is moving focus to the result heading. On unmount, remove the listener. Do not infer fullscreen from local button state.

- [ ] **Step 2: Implement start, reset, finish, pause, and fullscreen behavior**

Use these actions and preserve their focus behavior:

```tsx
const startTest = useCallback(() => {
  setSessionKey((key) => key + 1);
  setSummary(EMPTY_SUMMARY);
  setNotice(null);
  setDownloadError(null);
  setPhase("active");

  const host = hostRef.current;
  if (host?.requestFullscreen && document.fullscreenEnabled) {
    void host.requestFullscreen().catch(() => {
      setNotice("Fullscreen was blocked. The touch test still works in this page.");
    });
  }
}, []);

const resetTest = useCallback(() => {
  setSessionKey((key) => key + 1);
  setSummary(EMPTY_SUMMARY);
  setNotice("Grid cleared. Start another pass from the corners.");
  setPhase("active");
}, []);

const finishTest = useCallback(() => {
  setPhase("result");
  setNotice(
    summary.paintedCells === 0
      ? "No touch data recorded. Run the test again and drag across the grid."
      : null,
  );
  if (document.fullscreenElement) void document.exitFullscreen();
  requestAnimationFrame(() => resultHeadingRef.current?.focus());
}, [summary.paintedCells]);

const pauseForResize = useCallback(() => {
  setPhase("paused");
  setNotice("The test area changed size. Restart so every cell uses the same grid.");
}, []);

const toggleFullscreen = useCallback(async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (hostRef.current?.requestFullscreen && document.fullscreenEnabled) {
      await hostRef.current.requestFullscreen();
    } else {
      setNotice("Fullscreen is unavailable here. Keep testing inside this page.");
    }
  } catch {
    setNotice("Fullscreen was blocked. Keep testing inside this page.");
  }
}, []);
```

When the user leaves fullscreen after a result, focus the result heading. When the user chooses Test Again from the result, call `startTest`. If leaving fullscreen changes the painted grid geometry, the canvas resize observer pauses the session and asks for a restart instead of pretending the old coverage map is still valid.

- [ ] **Step 3: Implement a local-only PNG download**

```tsx
const downloadResult = useCallback(async () => {
  setDownloadError(null);
  const blob = await canvasRef.current?.exportResult(summary);
  if (!blob) {
    setDownloadError("The image could not be created. Try the download again.");
    return;
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `screentesthub-touch-result-${new Date()
    .toISOString()
    .slice(0, 10)}.png`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}, [summary]);
```

No fetch, server action, storage API, or analytics event may contain pointer coordinates or the generated image.

- [ ] **Step 4: Render the exact control and metric hierarchy**

The component output must follow this order:

1. Start action row.
2. Diagnostic bench with metric strip, canvas, and controls.
3. Inline notice.
4. Result summary.

Inside `.bench`, render `.metricRail`, `.canvasFrame`, then `.controlStack` as siblings. CSS Grid places the metrics and controls in the desktop right rail; the mobile flex layout places metrics above the canvas and controls below it.

Keep the Start Touch Test button mounted above the bench in every phase. During an active phase it starts a clean pass after confirmation text stating that the current map will be cleared. Next to it, render `Touch input detected` when `touchCapable` is true, `Mouse preview available on this device` when false, and no capability claim until the client check has completed.

Use native buttons with these labels: `Start Touch Test`, `Reset`, `Enter fullscreen` or `Exit fullscreen`, `Finish`, `Test Again`, and `Download Result`. The bench gets `aria-label="Touchscreen checker"`. The metrics are `Coverage`, `Live touches`, and `Peak touches`. Put their values in a throttled `aria-live="polite"` summary, not three separate live regions.

The canvas props must be wired exactly as:

```tsx
<TouchGridCanvas
  active={phase === "active"}
  frozen={phase === "paused" || phase === "result"}
  onGeometryInvalidated={pauseForResize}
  onSummary={setSummary}
  ref={canvasRef}
  sessionKey={sessionKey}
/>
```

The result heading must have `tabIndex={-1}` and ref `resultHeadingRef`. Label a mouse-only result `Desktop pointer preview`; otherwise label it `Touch input result`.

Render one interpretation from measured data:

```tsx
const interpretation =
  summary.paintedCells === 0
    ? "No touch path was recorded. Test again before judging the screen."
    : summary.largestMissedRegion === 0
      ? "Every grid cell received input in this pass."
      : summary.largestMissedRegion >= 4
        ? `A connected area of ${summary.largestMissedRegion} cells stayed blank. Repeat the pass slowly to see whether it fails in the same place.`
        : "The remaining blank cells are isolated. Repeat the edges and corners before treating them as a dead zone.";
```

Display the interpretation as normal text beside coverage, missed cells, and peak touches. Do not call a single pass a hardware diagnosis.

- [ ] **Step 5: Expand the module styles into the approved bench**

Add these structural rules to `TouchScreenTest.module.css`:

```css
.startRow {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.25rem 0 1rem;
}

.primaryButton,
.secondaryButton,
.quietButton {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.62rem 0.9rem;
  border: 1px solid var(--ink);
  border-radius: 5px;
  font-weight: 750;
  cursor: pointer;
  transition: transform 170ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 170ms cubic-bezier(0.16, 1, 0.3, 1);
}

.primaryButton {
  color: var(--on-accent);
  background: var(--accent-deep);
  box-shadow: 4px 4px 0 var(--ink);
}

.secondaryButton,
.quietButton {
  color: var(--ink);
  background: var(--paper-strong);
}

.primaryButton:hover,
.secondaryButton:hover,
.quietButton:hover {
  transform: translateY(-2px);
}

.bench {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 11rem;
  grid-template-rows: minmax(0, 1fr) auto;
  min-height: 34rem;
  overflow: hidden;
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  background:
    radial-gradient(circle at 14% 6%, rgb(255 255 255 / 11%), transparent 24rem),
    #171916;
  box-shadow: var(--shadow);
}

.bench:fullscreen {
  width: 100vw;
  min-height: 100dvh;
  border: 0;
  border-radius: 0;
}

.metricRail {
  display: flex;
  flex-direction: column;
  grid-column: 2;
  grid-row: 1;
  border-left: 1px solid #62665f;
  color: #fffaf4;
  background: #20231f;
}

.metric {
  display: grid;
  gap: 0.15rem;
  padding: 1rem;
  border-bottom: 1px solid #62665f;
}

.metric span {
  color: #c8cbc4;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.metric strong {
  font-family: var(--font-mono);
  font-size: 1.35rem;
}

.controlStack {
  display: grid;
  grid-column: 2;
  grid-row: 2;
  gap: 0.55rem;
  padding: 0.8rem;
  border-top: 1px solid #62665f;
  color: #fffaf4;
  background: #20231f;
}

.canvasFrame {
  grid-column: 1;
  grid-row: 1 / span 2;
}

.notice {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  margin: 0.9rem 0 0;
  color: var(--muted);
}

.resultPanel {
  margin-top: 1.25rem;
  padding: clamp(1rem, 3vw, 1.6rem);
  border: 1px solid var(--line-strong);
  background:
    linear-gradient(128deg, rgb(161 61 29 / 10%), transparent 42%),
    var(--paper-strong);
}

.resultPanel h2 {
  margin: 0;
  font-size: clamp(1.45rem, 3vw, 2rem);
}

.resultActions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

@media (max-width: 48rem) {
  .bench {
    display: flex;
    min-height: 0;
    flex-direction: column;
  }

  .metricRail {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    order: -1;
    border-bottom: 1px solid #62665f;
    border-left: 0;
  }

  .metric {
    min-width: 0;
    padding: 0.7rem;
    border-right: 1px solid #62665f;
    border-bottom: 0;
  }

  .metric strong {
    font-size: 1rem;
  }

  .controlStack {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-top: 1px solid #62665f;
  }
}

@media (prefers-reduced-motion: reduce) {
  .primaryButton,
  .secondaryButton,
  .quietButton {
    transition: none;
  }
}
```

Use the existing global light and dark tokens. Do not introduce purple, indigo, neon green, Tailwind default colors, `ease-in-out`, or oversized display text.

- [ ] **Step 6: Verify and commit the diagnostic bench**

Run:

```powershell
npm test
npm run typecheck
rg -n "transition-all|ease-in-out|#6366F1|#8B5CF6|[—–]" components/touch
```

Expected: tests PASS, typecheck exits 0, and the source scan prints no matches.

Commit:

```powershell
git add components/touch/TouchScreenTest.tsx components/touch/TouchScreenTest.module.css
git commit -m "Build touch diagnostic bench"
```

---

### Task 4: Create the Static SEO Page and Researched FAQ

**Files:**
- Create: `app/touch-screen-test/page.tsx`
- Modify: `components/touch/TouchScreenTest.module.css`

- [ ] **Step 1: Define metadata and shared FAQ data**

At the top of `app/touch-screen-test/page.tsx`, define one canonical URL, one description constant, and one FAQ array. Reuse the same FAQ array for visible HTML and `FAQPage` JSON-LD so wording cannot drift.

```tsx
import type { Metadata } from "next";
import { ArrowRight, Hand, ScanLine, Smartphone } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import Link from "@/components/site/no-prefetch-link";
import { TouchScreenTest } from "@/components/touch/TouchScreenTest";
import styles from "@/components/touch/TouchScreenTest.module.css";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

const canonicalUrl = absoluteUrl("/touch-screen-test/");
const description =
  "Run a free touch screen test online to find dead zones, ghost touches, missed swipes, and multi-touch issues on phones, tablets, and touchscreen laptops.";

export const metadata: Metadata = {
  title: { absolute: `Touch Screen Test Online - Phone Touchscreen Checker | ${SITE_NAME}` },
  description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "Touch Screen Test Online - Phone Touchscreen Checker",
    description,
    type: "website",
    url: canonicalUrl,
  },
};

const faqs = [
  {
    question: "How can I find a touchscreen dead zone?",
    answer:
      "Run the grid twice and swipe slowly through every edge and corner. A dead zone is more likely when the same connected group of cells stays blank on both passes. Restart the device and repeat the test before assuming the digitizer is faulty.",
  },
  {
    question: "Can this test confirm ghost touch?",
    answer:
      "No browser test can prove the cause. If touch points appear while the screen is clean, dry, unplugged, and untouched, repeat the test after a restart. Persistent unexpected input across apps is a reason to contact the manufacturer or a repair technician.",
  },
  {
    question: "Can a screen protector cause ghost touches?",
    answer:
      "It can. Dirt, trapped moisture, lifting edges, cracks, or a poorly fitted protector can affect capacitive input. Clean and dry the screen first. If the issue continues, test without the protector only when it can be removed safely.",
  },
  {
    question: "Why does ghost touch happen only while charging?",
    answer:
      "Community reports often link charging-only input problems to a cable, charger, port, or grounding issue. Test while unplugged, then try a trusted charger and cable. Stop using any charger that becomes unusually hot, damaged, or electrically unsafe.",
  },
  {
    question: "Can water or damp fingers affect the result?",
    answer:
      "Yes. Water droplets and damp fingers can register as extra capacitive input or make swipes inconsistent. Dry the screen and hands completely before repeating the test.",
  },
  {
    question: "What should I do if the same area keeps failing?",
    answer:
      "Restart the device, remove the case if it presses on the display, clean the screen, and repeat the test unplugged. If the same area still fails in multiple apps, save the result and contact support or a repair technician.",
  },
  {
    question: "How many simultaneous touch points does my screen support?",
    answer:
      "Place several fingers on the grid and watch Peak touches. The displayed number is what the browser and operating system report during this session, which may be lower than the digitizer's advertised hardware maximum.",
  },
] as const;
```

- [ ] **Step 2: Add all three structured-data nodes**

```tsx
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#application`,
      name: "ScreenTestHub Touch Screen Test",
      description,
      url: canonicalUrl,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "A modern browser with Pointer Events. Fullscreen is optional.",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Touch Screen Test", item: canonicalUrl },
      ],
    },
  ],
};
```

- [ ] **Step 3: Render content in the exact requested order**

The page body must be:

```tsx
export default function TouchScreenTestPage() {
  return (
    <div className={styles.page}>
      <JsonLd data={structuredData} />

      <header className={styles.pageHeader}>
        <h1>Touch Screen Test Online</h1>
        <p>
          Check every part of your phone, tablet, or touchscreen laptop for missed taps and broken touch paths.
        </p>
      </header>

      <TouchScreenTest />

      <section aria-labelledby="touch-how-title" className={styles.contentSection}>
        <h2 id="touch-how-title">How to use this touch screen test</h2>
        <ul className={styles.instructionList}>
          <li>Open the test and enter fullscreen when available.</li>
          <li>Slide one finger across the entire grid, including every edge and corner.</li>
          <li>Place several fingers on the screen to check simultaneous touch reporting.</li>
          <li>Finish the test and inspect any continuous blank area or broken path.</li>
        </ul>
      </section>

      <section aria-labelledby="touch-look-title" className={styles.contentSection}>
        <h2 id="touch-look-title">What to look for</h2>
        <dl className={styles.observationList}>
          <div><dt>Continuous blank area</dt><dd>The same cluster of cells stays untouched after repeated passes.</dd></div>
          <div><dt>Broken swipe path</dt><dd>A line repeatedly stops or skips in one location.</dd></div>
          <div><dt>Unexpected points</dt><dd>The tool receives input while your hands are off the screen.</dd></div>
          <div><dt>Edge or corner misses</dt><dd>Taps near the bezel fail while the center works.</dd></div>
          <div><dt>Multi-touch dropout</dt><dd>Live touches falls below the number of fingers placed on the screen.</dd></div>
        </dl>
        <p className={styles.limitation}>
          This touchscreen checker observes browser input. It cannot identify the failed physical component or certify hardware.
        </p>
      </section>

      <section aria-labelledby="touch-faq-title" className={styles.contentSection}>
        <h2 id="touch-faq-title">Touch screen test FAQ</h2>
        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="touch-related-title" className={styles.contentSection}>
        <h2 id="touch-related-title">Related tools</h2>
        <div className={styles.relatedList}>
          <Link href="/tests/guided"><ScanLine aria-hidden="true" size={20} /><span><strong>Guided Screen Test</strong><small>Run six display checks in one pass.</small></span><ArrowRight aria-hidden="true" size={18} /></Link>
          <Link href="/tests/dead-pixel"><Hand aria-hidden="true" size={20} /><span><strong>Dead Pixel Test</strong><small>Check for pixels that stay dark or stuck.</small></span><ArrowRight aria-hidden="true" size={18} /></Link>
          <Link href="/tests/color"><Smartphone aria-hidden="true" size={20} /><span><strong>Monitor Color Test</strong><small>Inspect solid RGB and CMY fields.</small></span><ArrowRight aria-hidden="true" size={18} /></Link>
        </div>
      </section>
    </div>
  );
}
```

There must be no breadcrumb, eyebrow, or metadata row before the H1. The interactive component owns the immediate Start Touch Test button and tool, so the visible sequence remains H1, Start Test, Tool, How to use, What to look for, FAQ, Related tools.

- [ ] **Step 4: Add the static content styles**

Extend `TouchScreenTest.module.css` with a 74rem page container, compact left-aligned header, 52px desktop H1 cap, 36px mobile H1 cap, uneven observation rows, native `details` FAQ rows, and a vertically stacked related-tool list. Use `var(--paper)`, `var(--paper-strong)`, `var(--ink)`, `var(--muted)`, `var(--line)`, and `var(--accent-deep)` only. Do not make three equal cards.

Required declarations:

```css
.page { width: min(calc(100% - 2rem), 74rem); margin-inline: auto; padding: clamp(2.25rem, 6vw, 4.5rem) 0 6rem; }
.pageHeader { max-width: 48rem; }
.pageHeader h1 { max-width: 18ch; margin: 0; font-size: clamp(2.25rem, 5vw, 3.25rem); line-height: 1; letter-spacing: -0.045em; }
.pageHeader p { max-width: 62ch; margin: 1rem 0 0; color: var(--muted); font-size: 1.05rem; }
.contentSection { margin-top: clamp(3.25rem, 8vw, 6rem); border-top: 1px solid var(--line-strong); padding-top: 1.2rem; }
.contentSection h2 { max-width: 24ch; margin: 0 0 1.25rem; font-size: clamp(1.55rem, 3vw, 2.25rem); line-height: 1.08; }
.instructionList { display: grid; gap: 0.9rem; max-width: 52rem; padding: 0; list-style: none; }
.instructionList li { padding: 0.9rem 1rem; border-left: 3px solid var(--accent-deep); background: linear-gradient(90deg, rgb(161 61 29 / 8%), transparent); }
.observationList { margin: 0; }
.observationList > div { display: grid; grid-template-columns: minmax(11rem, 0.42fr) minmax(0, 1fr); gap: 1.5rem; padding: 1rem 0; border-bottom: 1px solid var(--line); }
.observationList dt { font-weight: 800; }
.observationList dd { margin: 0; color: var(--muted); }
.limitation { max-width: 58rem; margin: 1.25rem 0 0; padding: 1rem; border: 1px solid var(--line); background: var(--paper-strong); }
.faqList { border-top: 1px solid var(--line); }
.faqList details { border-bottom: 1px solid var(--line); }
.faqList summary { padding: 1rem 2.5rem 1rem 0; font-weight: 780; cursor: pointer; }
.faqList p { max-width: 65ch; margin: 0; padding: 0 0 1.15rem; color: var(--muted); }
.relatedList { display: flex; flex-direction: column; border-top: 1px solid var(--line); }
.relatedList a { display: grid; grid-template-columns: auto 1fr auto; gap: 0.9rem; align-items: center; padding: 1rem 0.2rem; border-bottom: 1px solid var(--line); text-decoration: none; }
.relatedList strong, .relatedList small { display: block; }
.relatedList small { color: var(--muted); }
@media (max-width: 36rem) { .pageHeader h1 { font-size: clamp(2.1rem, 10vw, 2.25rem); } .observationList > div { grid-template-columns: 1fr; gap: 0.25rem; } }
```

- [ ] **Step 5: Verify server and client boundaries, then commit**

Run:

```powershell
npm run typecheck
npm run build
```

Expected: typecheck exits 0; build lists `/touch-screen-test` as a static route and emits no browser-global error during prerendering.

Commit:

```powershell
git add app/touch-screen-test/page.tsx components/touch/TouchScreenTest.module.css
git commit -m "Add touch screen test SEO page"
```

---

### Task 5: Register the Tool in Navigation and Sitemap

**Files:**
- Modify: `lib/site.ts`
- Modify: `components/site/site-navigation.tsx`

- [ ] **Step 1: Add the route to the shared catalog**

In `lib/site.ts`, update the modified date and insert the touch test directly after the `/tests` index so it appears first in both desktop and mobile tool menus:

```ts
export const SITE_LAST_MODIFIED = "2026-08-11";

export const TEST_ROUTES = [
  { href: "/tests", label: "All screen tests" },
  { href: "/touch-screen-test/", label: "Touch Screen Test" },
  { href: "/tests/guided", label: "Guided Screen Test" },
  { href: "/tests/dead-pixel", label: "Dead Pixel Test" },
  { href: "/tests/backlight-bleed", label: "Backlight Bleed Test" },
  { href: "/tests/grayscale", label: "Grayscale and Uniformity Test" },
  { href: "/tests/gradient", label: "Gradient Banding Test" },
  { href: "/tests/motion", label: "Motion and Ghosting Test" },
  { href: "/tests/color", label: "Monitor Color Test" },
] as const satisfies readonly SiteRoute[];
```

`app/sitemap.ts` already maps `TEST_ROUTES`, so no direct sitemap edit is needed.

- [ ] **Step 2: Make Tools active for top-level tool routes**

In `components/site/site-navigation.tsx`, add this derived value after `[allTestsRoute, ...testTools]`:

```tsx
const toolsActive = tools.some((tool) => {
  const href = tool.href === "/" ? "/" : tool.href.replace(/\/$/u, "");
  return pathname === href || pathname.startsWith(`${href}/`);
});
```

Replace both occurrences of:

```tsx
data-active={pathname.startsWith("/tests")}
```

with:

```tsx
data-active={toolsActive}
```

This keeps desktop and mobile states synchronized and avoids hard-coding the new pathname in two places.

- [ ] **Step 3: Verify route discovery and commit**

Run:

```powershell
npm run typecheck
npm run build
Select-String -LiteralPath '.next/server/app/sitemap.xml.body' -Pattern 'touch-screen-test'
```

Expected: typecheck and build exit 0; sitemap output contains `https://screentesthub.com/touch-screen-test/`.

Commit:

```powershell
git add lib/site.ts components/site/site-navigation.tsx
git commit -m "Expose touch test in site navigation"
```

---

### Task 6: Browser Interaction and Accessibility Verification

**Files:**
- Modify if defects are found: `components/touch/TouchGridCanvas.tsx`
- Modify if defects are found: `components/touch/TouchScreenTest.tsx`
- Modify if defects are found: `components/touch/TouchScreenTest.module.css`
- Modify if defects are found: `app/touch-screen-test/page.tsx`

- [ ] **Step 1: Start the local app**

Run in a persistent terminal:

```powershell
npm run dev
```

Expected: Next.js reports a local URL and compiles `/touch-screen-test` without an error.

- [ ] **Step 2: Verify the idle and active layouts at desktop width**

Open `/touch-screen-test/` at 1440 by 1000 and confirm:

- H1 is compact and left aligned.
- Start Touch Test appears before the grid.
- The active desktop bench has a wide grid and 160px to 180px right rail.
- Coverage, Live touches, and Peak touches update without visible React rerender flicker.
- Reset clears the grid.
- Finish freezes the map and focuses the result heading.

Expected: all checks pass with no console error.

- [ ] **Step 3: Verify pointer edge cases**

Use browser automation to dispatch two synthetic `pointerdown` events with distinct pointer IDs on the canvas, then one `pointercancel`. Confirm Peak touches reaches 2, Live touches returns to 1, and cancelling one pointer does not erase coverage. Dispatch the remaining `pointerup` and confirm Live touches returns to 0.

Expected: counts read 2, then 1, then 0; the painted cells remain visible.

- [ ] **Step 4: Verify fullscreen and invalidation paths**

Confirm:

- Fullscreen success expands only the diagnostic bench.
- Exiting fullscreen keeps the session in-page.
- A rejected fullscreen request produces the inline fallback note.
- Changing viewport orientation or the grid container size during an active painted session pauses it and asks for a restart.
- Hiding the tab or blurring the window clears active touch circles and Live touches.

Expected: no trapped fullscreen, stale pointer, or lost keyboard focus.

- [ ] **Step 5: Verify mobile and accessibility behavior**

At 390 by 844, confirm:

- Metrics move above the canvas.
- Reset, Fullscreen, and Finish remain reachable below it.
- The canvas does not scroll the page while active, but static sections scroll normally.
- The mobile hamburger includes Tools, and Tools expands to show Touch Screen Test.
- Result data is available as text.
- Focus moves to the result heading after Finish.
- Every action has a visible focus ring.
- Both `prefers-color-scheme: light` and `dark` retain readable contrast.

Expected: no horizontal overflow or hidden control.

- [ ] **Step 6: Verify result export and content order**

Paint at least ten cells, finish, and choose Download Result. Open the PNG and confirm it includes the grid, coverage, missed cells, peak touches, page name, and date. Inspect the document headings and confirm the order is H1, How to use, What to look for, FAQ, Related tools, with Start Test and the tool between H1 and How to use.

Expected: a non-empty PNG downloads locally; visible FAQ answers exactly match FAQ JSON-LD.

- [ ] **Step 7: Commit only if verification required fixes**

```powershell
git add components/touch app/touch-screen-test/page.tsx
git commit -m "Fix touch test browser behavior"
```

If no defects were found, do not create an empty commit.

---

### Task 7: Cloudflare Runtime and SEO Release Validation

**Files:**
- No code changes expected
- Modify only if validation exposes a defect: files named in Tasks 1 through 6

- [ ] **Step 1: Run the complete local gate**

```powershell
npm test
npm run typecheck
npm run build
git diff --check
rg -n "transition-all|ease-in-out|[—–]" app/touch-screen-test components/touch lib/touch-grid.ts
```

Expected: tests, typecheck, build, and diff check pass; the source scan prints no matches.

- [ ] **Step 2: Run the OpenNext Workers preview**

Run in a persistent terminal:

```powershell
npm run preview
```

Expected: OpenNext builds successfully and Wrangler starts the Worker at `http://127.0.0.1:8787` without a workerd runtime error.

- [ ] **Step 3: Probe the Worker-rendered public resources**

In a second terminal:

```powershell
$paths = @('/touch-screen-test/', '/robots.txt', '/sitemap.xml')
$paths | ForEach-Object {
  $response = Invoke-WebRequest -Uri ("http://127.0.0.1:8787" + $_) -UseBasicParsing
  [pscustomobject]@{ Path = $_; Status = $response.StatusCode; Type = $response.Headers['Content-Type'] }
}
```

Expected: all three paths return 200; the page is HTML, robots is text, and sitemap is XML.

- [ ] **Step 4: Verify canonical and schema in the Worker response**

```powershell
$html = (Invoke-WebRequest -Uri 'http://127.0.0.1:8787/touch-screen-test/' -UseBasicParsing).Content
$checks = @(
  'https://screentesthub.com/touch-screen-test/',
  'Touch Screen Test Online',
  'FAQPage',
  'WebApplication',
  'BreadcrumbList'
)
$checks | ForEach-Object { if ($html -notmatch [regex]::Escape($_)) { throw "Missing: $_" } }
```

Expected: command exits silently with code 0.

- [ ] **Step 5: Review the final commit range**

```powershell
git status -sb
git log --oneline 8d73d79..HEAD
git diff --stat 8d73d79..HEAD
```

Expected: no uncommitted product changes; the log shows small commits for model, canvas, bench, page, navigation, and any verified fix.

- [ ] **Step 6: Stop before deployment unless separately authorized**

Report the local and Workers-preview results, remaining device-only limitations, and commit list. Deployment and pushing are separate state-changing actions and require the user's explicit instruction.

---

## Spec Coverage Check

- Exact page order: Task 4, Step 3; Task 6, Step 6.
- Diagnostic bench desktop and mobile layouts: Tasks 3 and 6.
- Coverage, fast swipes, current and peak touches: Tasks 1 and 2.
- Fullscreen fallback, resize pause, pointer cancellation, hidden-tab cleanup: Tasks 2, 3, and 6.
- Result summary and local PNG: Tasks 2, 3, and 6.
- SEO keywords, metadata, canonical, and three schema nodes: Tasks 4 and 7.
- Reddit-derived FAQ questions with cautious answers: Task 4.
- Related tools and no-prefetch internal links: Task 4.
- Desktop and mobile Tools menus: Task 5.
- Static-first App Router and Cloudflare compatibility: Tasks 4 and 7.
- Both themes, reduced motion, accessibility, and compact H1: Tasks 3, 4, and 6.
- No server storage, external API, login, or hardware-certification claim: enforced throughout Tasks 2 through 7.
