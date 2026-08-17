"use client";

import { useCallback, useState } from "react";

import {
  BLACK_LEVEL_MODES,
  DEPTH_COMPARE_LEVELS,
  DEPTH_PATCH_LEVELS,
  DEPTH_STRIPE_LEVEL,
  NEAR_BLACK_LEVELS,
  NEAR_BLACK_RAMP_END,
  stepBlackLevelMode,
  type BlackLevelMode,
} from "@/lib/black-level";
import type { Locale } from "@/lib/i18n";
import { testStartEventName } from "@/lib/test-events";
import { getTestMessages } from "@/lib/test-messages";
import { FullscreenTest } from "./FullscreenTest";
import styles from "./ScreenTests.module.css";

const BLACK_LEVEL_UI = {
  en: {
    name: "Black level test",
    modeLabel: "Black level test mode",
    modes: {
      pure: "Pure black",
      levels: "Near-black 1-10",
      depth: "Black depth",
    },
    statuses: {
      pure: "Pure black, 1 of 3. Hide controls and wait 30 seconds.",
      levels: "Near-black, 2 of 3. Count the blocks you can separate from black.",
      depth: "Black depth, 3 of 3. Look for four patches, fine stripes, and two comparison squares.",
    },
    surfaces: {
      pure: "Full-screen pure black RGB 0 uniformity pattern",
      levels: "Full-screen near-black pattern with RGB levels 1 through 10 and a gradient from RGB 0 to 20",
      depth: "Full-screen black depth pattern with RGB 2, 4, 6, and 8 patches, RGB 3 stripes, and RGB 3 and 5 comparison squares",
    },
  },
  zh: {
    name: "黑位测试",
    modeLabel: "黑位测试模式",
    modes: {
      pure: "纯黑均匀性",
      levels: "近黑阶 1-10",
      depth: "黑位深度",
    },
    statuses: {
      pure: "纯黑，第 1/3 项。隐藏控制栏，等待眼睛适应 30 秒。",
      levels: "近黑阶，第 2/3 项。数一数能与黑色分开的色块。",
      depth: "黑位深度，第 3/3 项。寻找 4 个暗块、细横纹和 2 个对比方块。",
    },
    surfaces: {
      pure: "全屏 RGB 0 纯黑均匀性图案",
      levels: "全屏近黑阶图案，包含 RGB 1 到 10 色块与 RGB 0 到 20 渐变",
      depth: "全屏黑位深度图案，包含 RGB 2、4、6、8 暗块，RGB 3 横纹以及 RGB 3 和 5 对比方块",
    },
  },
  de: {
    name: "Schwarzpegel-Test",
    modeLabel: "Modus für den Schwarzpegel-Test",
    modes: {
      pure: "Reines Schwarz",
      levels: "Dunkelstufen 1-10",
      depth: "Schwarztiefe",
    },
    statuses: {
      pure: "Reines Schwarz, 1 von 3. Blende die Steuerung aus und warte 30 Sekunden.",
      levels: "Dunkelstufen, 2 von 3. Zähle die Felder, die du von Schwarz trennen kannst.",
      depth: "Schwarztiefe, 3 von 3. Suche vier Felder, feine Streifen und zwei Vergleichsquadrate.",
    },
    surfaces: {
      pure: "Vollbildmuster in reinem Schwarz RGB 0 zur Gleichmäßigkeitsprüfung",
      levels: "Vollbildmuster mit RGB-Stufen 1 bis 10 und einem Verlauf von RGB 0 bis 20",
      depth: "Vollbildmuster mit RGB-Feldern 2, 4, 6 und 8, RGB-3-Streifen sowie RGB-3- und RGB-5-Vergleichsquadraten",
    },
  },
} as const;

function rgb(level: number) {
  return `rgb(${level} ${level} ${level})`;
}

function PureBlackPattern() {
  return (
    <div
      aria-hidden="true"
      className={`${styles.blackLevelPattern} ${styles.blackLevelPure}`}
      data-black-level-pattern="pure"
    />
  );
}

function NearBlackPattern() {
  return (
    <div
      aria-hidden="true"
      className={`${styles.blackLevelPattern} ${styles.blackLevelNear}`}
      data-black-level-pattern="levels"
    >
      <div className={styles.blackLevelNearGrid}>
        {NEAR_BLACK_LEVELS.map((level) => (
          <span
            data-black-level={level}
            key={level}
            style={{ backgroundColor: rgb(level) }}
          />
        ))}
      </div>
      <div
        className={styles.blackLevelRamp}
        data-ramp-end={NEAR_BLACK_RAMP_END}
        style={{
          backgroundImage: `linear-gradient(to right, ${rgb(0)}, ${rgb(NEAR_BLACK_RAMP_END)})`,
        }}
      />
    </div>
  );
}

function BlackDepthPattern() {
  return (
    <div
      aria-hidden="true"
      className={`${styles.blackLevelPattern} ${styles.blackLevelDepth}`}
      data-black-level-pattern="depth"
    >
      <div className={styles.blackLevelDepthPatches}>
        {DEPTH_PATCH_LEVELS.map((level) => (
          <span data-depth-level={level} key={level}>
            <i style={{ backgroundColor: rgb(level) }} />
          </span>
        ))}
      </div>
      <div
        className={styles.blackLevelStripes}
        data-stripe-level={DEPTH_STRIPE_LEVEL}
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, ${rgb(0)} 0 3px, ${rgb(DEPTH_STRIPE_LEVEL)} 3px 6px)`,
        }}
      />
      <div className={styles.blackLevelCompare}>
        {DEPTH_COMPARE_LEVELS.map((level) => (
          <span data-compare-level={level} key={level}>
            <i style={{ backgroundColor: rgb(level) }} />
          </span>
        ))}
      </div>
    </div>
  );
}

function BlackLevelPattern({ mode }: { mode: BlackLevelMode }) {
  if (mode === "pure") return <PureBlackPattern />;
  if (mode === "levels") return <NearBlackPattern />;
  return <BlackDepthPattern />;
}

export function BlackLevelTest({ locale = "en" }: { locale?: Locale } = {}) {
  const copy = BLACK_LEVEL_UI[locale];
  const [mode, setMode] = useState<BlackLevelMode>("pure");

  const showPrevious = useCallback(() => {
    setMode((current) => stepBlackLevelMode(current, -1));
  }, []);

  const showNext = useCallback(() => {
    setMode((current) => stepBlackLevelMode(current, 1));
  }, []);

  return (
    <FullscreenTest
      advanceOnSurfaceClick
      controls={
        <div aria-label={copy.modeLabel} className={styles.toolGroup} role="group">
          {BLACK_LEVEL_MODES.map((candidate) => (
            <button
              aria-pressed={candidate === mode}
              className={styles.toolButton}
              data-selected={candidate === mode}
              key={candidate}
              onClick={() => setMode(candidate)}
              type="button"
            >
              {copy.modes[candidate]}
            </button>
          ))}
        </div>
      }
      messages={getTestMessages(locale).fullscreen}
      name={copy.name}
      onNext={showNext}
      onPrevious={showPrevious}
      startEventName={testStartEventName("black-level-test")}
      status={copy.statuses[mode]}
      surfaceLabel={copy.surfaces[mode]}
      toolbarLayout="docked"
    >
      <BlackLevelPattern mode={mode} />
    </FullscreenTest>
  );
}
