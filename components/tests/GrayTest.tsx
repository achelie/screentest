"use client";

import { useCallback, useState } from "react";

import { FullscreenTest } from "./FullscreenTest";
import { testStartEventName } from "@/lib/test-events";
import styles from "./ScreenTests.module.css";
import type { TestMessages } from "@/lib/test-messages";

const GRAY_LEVELS = [5, 10, 25, 50, 75, 100] as const;

export function GrayTest({ messages }: { messages: Pick<TestMessages, "fullscreen" | "gray"> }) {
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
      messages={messages.fullscreen}
      name={messages.gray.name}
      onNext={showNext}
      onPrevious={showPrevious}
      status={messages.gray.status.replace("{level}", String(level))}
      surfaceLabel={messages.gray.surface.replace("{level}", String(level))}
      startEventName={testStartEventName("grayscale")}
      controls={
        <div aria-label={messages.gray.levelLabel} className={styles.toolGroup} role="group">
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
