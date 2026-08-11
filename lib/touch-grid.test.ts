import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import {
  cellIndexAt,
  coverageResult,
  interpolateCellIndexes,
  largestMissedRegion,
  nextPeakTouchCount,
} from './touch-grid';

test('cellIndexAt maps coordinates and clamps the far edge', () => {
  const surface = { width: 100, height: 80 };
  const grid = { columns: 10, rows: 8 };

  assert.equal(cellIndexAt({ x: 0, y: 0 }, surface, grid), 0);
  assert.equal(cellIndexAt({ x: 99.9, y: 79.9 }, surface, grid), 79);
  assert.equal(cellIndexAt({ x: 100, y: 80 }, surface, grid), 79);
  assert.equal(cellIndexAt({ x: -1, y: 0 }, surface, grid), null);
  assert.equal(cellIndexAt({ x: 101, y: 0 }, surface, grid), null);
});

test('interpolateCellIndexes fills every cell in a fast horizontal swipe', () => {
  assert.deepEqual(
    interpolateCellIndexes(
      { x: 5, y: 5 },
      { x: 95, y: 5 },
      { width: 100, height: 80 },
      { columns: 10, rows: 8 },
    ),
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
});

test('interpolateCellIndexes keeps diagonal cells deduplicated in traversal order', () => {
  assert.deepEqual(
    interpolateCellIndexes(
      { x: 5, y: 5 },
      { x: 25, y: 25 },
      { width: 100, height: 80 },
      { columns: 10, rows: 8 },
    ),
    [0, 11, 22],
  );
});

test('interpolateCellIndexes rejects non-finite endpoint coordinates immediately', () => {
  const surface = { width: 100, height: 80 };
  const grid = { columns: 10, rows: 8 };
  assert.deepEqual(interpolateCellIndexes({ x: Number.NaN, y: 5 }, { x: 95, y: 5 }, surface, grid), []);

  const moduleUrl = new URL('./touch-grid.ts', import.meta.url).href;
  const probe = `
    import { interpolateCellIndexes } from ${JSON.stringify(moduleUrl)};
    const result = interpolateCellIndexes(
      { x: 5, y: 5 },
      { x: Infinity, y: 5 },
      { width: 100, height: 80 },
      { columns: 10, rows: 8 },
    );
    if (JSON.stringify(result) !== '[]') process.exit(1);
  `;
  const child = spawnSync(process.execPath, ['--input-type=module', '--eval', probe], {
    encoding: 'utf8',
    timeout: 1_000,
  });

  assert.equal(child.status, 0, child.error?.message ?? child.stderr);
});

test('coverageResult reports painted, missed, percentage, and largest gap', () => {
  assert.deepEqual(coverageResult(new Set([0, 1, 2]), { columns: 2, rows: 2 }), {
    painted: 3,
    missed: 1,
    total: 4,
    percent: 75,
    largestMissedRegion: 1,
  });
});

test('largestMissedRegion uses orthogonal adjacency', () => {
  assert.equal(largestMissedRegion(new Set([0, 1, 2]), { columns: 3, rows: 2 }), 3);
  assert.equal(largestMissedRegion(new Set([0, 1, 2, 3, 4, 5]), { columns: 3, rows: 2 }), 0);
});

test('nextPeakTouchCount keeps the highest active count', () => {
  assert.equal(nextPeakTouchCount(2, 1), 2);
  assert.equal(nextPeakTouchCount(2, 4), 4);
});
