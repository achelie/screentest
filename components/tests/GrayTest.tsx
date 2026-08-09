"use client";

import { useCallback, useState } from "react";

import { FullscreenTest } from "./FullscreenTest";
import styles from "./ScreenTests.module.css";

const GRAY_LEVELS = [5, 10, 25, 50, 75, 100] as const;

export function GrayTest() {
  const [activeIndex, setActiveIndex] = useState(3);
  const level = GRAY_LEVELS[activeIndex];
  const channelValue = Math.round((level / 100) * 255);

  const showPrevious = useCallback(() => {
    setActiveIndex(
      (current) => (current - 1 + GRAY_LEVELS.length) % GRAY_LEVELS.length,
    );
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % GRAY_LEVELS.length);
  }, []);

  return (
    <FullscreenTest
      name="Grayscale and uniformity test"
      onNext={showNext}
      onPrevious={showPrevious}
      status={`${level}% gray. Look for tint, cloudy patches, and darker edges.`}
      surfaceLabel={`Full-screen ${level}% gray uniformity pattern`}
      controls={
        <div aria-label="Gray level" className={styles.toolGroup} role="group">
          {GRAY_LEVELS.map((grayLevel, index) => (
            <button
              aria-pressed={index === activeIndex}
              className={styles.toolButton}
              data-selected={index === activeIndex}
              key={grayLevel}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              {grayLevel}%
            </button>
          ))}
        </div>
      }
    >
      <div
        className={styles.solidPattern}
        style={{
          backgroundColor: `rgb(${channelValue}, ${channelValue}, ${channelValue})`,
        }}
      />
    </FullscreenTest>
  );
}
