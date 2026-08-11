export type GridPoint = {
  x: number;
  y: number;
};

export type GridSize = {
  columns: number;
  rows: number;
};

export type CoverageResult = {
  painted: number;
  missed: number;
  total: number;
  percent: number;
  largestMissedRegion: number;
};

type SurfaceSize = {
  width: number;
  height: number;
};

function isValidSurface(surface: SurfaceSize): boolean {
  return Number.isFinite(surface.width) && Number.isFinite(surface.height)
    && surface.width > 0 && surface.height > 0;
}

function isValidGrid(grid: GridSize): boolean {
  return Number.isInteger(grid.columns) && Number.isInteger(grid.rows)
    && grid.columns > 0 && grid.rows > 0;
}

function totalCells(grid: GridSize): number {
  return isValidGrid(grid) ? grid.columns * grid.rows : 0;
}

export function cellIndexAt(
  point: GridPoint,
  surface: SurfaceSize,
  grid: GridSize,
): number | null {
  if (!isValidSurface(surface) || !isValidGrid(grid)
    || !Number.isFinite(point.x) || !Number.isFinite(point.y)
    || point.x < 0 || point.y < 0 || point.x > surface.width || point.y > surface.height) {
    return null;
  }

  const column = Math.min(grid.columns - 1, Math.floor(point.x / (surface.width / grid.columns)));
  const row = Math.min(grid.rows - 1, Math.floor(point.y / (surface.height / grid.rows)));
  return row * grid.columns + column;
}

export function interpolateCellIndexes(
  from: GridPoint,
  to: GridPoint,
  surface: SurfaceSize,
  grid: GridSize,
): number[] {
  if (!isValidSurface(surface) || !isValidGrid(grid)
    || !Number.isFinite(from.x) || !Number.isFinite(from.y)
    || !Number.isFinite(to.x) || !Number.isFinite(to.y)) return [];

  const maximumSpacing = Math.min(surface.width / grid.columns, surface.height / grid.rows) / 2;
  if (!Number.isFinite(maximumSpacing) || maximumSpacing <= 0) return [];

  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const steps = Math.max(1, Math.ceil(distance / maximumSpacing));
  const indexes: number[] = [];
  const seen = new Set<number>();

  for (let step = 0; step <= steps; step += 1) {
    const ratio = step / steps;
    const index = cellIndexAt({
      x: from.x + (to.x - from.x) * ratio,
      y: from.y + (to.y - from.y) * ratio,
    }, surface, grid);

    if (index !== null && !seen.has(index)) {
      seen.add(index);
      indexes.push(index);
    }
  }

  return indexes;
}

export function largestMissedRegion(painted: ReadonlySet<number>, grid: GridSize): number {
  const total = totalCells(grid);
  if (total === 0) return 0;

  const visited = new Set<number>();
  let largest = 0;

  for (let index = 0; index < total; index += 1) {
    if (painted.has(index) || visited.has(index)) continue;

    let regionSize = 0;
    const pending = [index];
    visited.add(index);

    while (pending.length > 0) {
      const current = pending.pop()!;
      regionSize += 1;
      const column = current % grid.columns;
      const neighbors = [
        current - grid.columns,
        current + grid.columns,
        column > 0 ? current - 1 : -1,
        column < grid.columns - 1 ? current + 1 : -1,
      ];

      for (const neighbor of neighbors) {
        if (neighbor >= 0 && neighbor < total && !painted.has(neighbor) && !visited.has(neighbor)) {
          visited.add(neighbor);
          pending.push(neighbor);
        }
      }
    }

    largest = Math.max(largest, regionSize);
  }

  return largest;
}

export function coverageResult(painted: ReadonlySet<number>, grid: GridSize): CoverageResult {
  const total = totalCells(grid);
  if (total === 0) {
    return { painted: 0, missed: 0, total: 0, percent: 0, largestMissedRegion: 0 };
  }

  const validPainted = new Set([...painted].filter((index) => Number.isInteger(index) && index >= 0 && index < total));
  const paintedCount = validPainted.size;
  const missed = total - paintedCount;

  return {
    painted: paintedCount,
    missed,
    total,
    percent: Math.round((paintedCount / total) * 1000) / 10,
    largestMissedRegion: largestMissedRegion(validPainted, grid),
  };
}

export function nextPeakTouchCount(currentPeak: number, activeCount: number): number {
  return Math.max(currentPeak, activeCount);
}
