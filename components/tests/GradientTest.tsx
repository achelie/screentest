"use client";

import { useCallback, useState } from "react";

import { FullscreenTest } from "./FullscreenTest";
import { testStartEventName } from "@/lib/test-events";
import styles from "./ScreenTests.module.css";
import type { TestMessages } from "@/lib/test-messages";

const CHANNELS = [
  { name: "Neutral", end: "#ffffff" },
  { name: "Red", end: "#ff0000" },
  { name: "Green", end: "#00ff00" },
  { name: "Blue", end: "#0000ff" },
] as const;

type Orientation = "horizontal" | "vertical";

export function GradientTest({ messages }: { messages: Pick<TestMessages, "fullscreen" | "gradient"> }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const channel = CHANNELS[activeIndex];
  const channelName = messages.gradient.channels[activeIndex];
  const orientationName = orientation === "horizontal" ? messages.gradient.horizontal : messages.gradient.vertical;
  const direction = orientation === "horizontal" ? "to right" : "to bottom";

  const showPrevious = useCallback(() => {
    setActiveIndex(
      (current) => (current - 1 + CHANNELS.length) % CHANNELS.length,
    );
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % CHANNELS.length);
  }, []);

  return (
    <FullscreenTest
      messages={messages.fullscreen}
      name={messages.gradient.name}
      onNext={showNext}
      onPrevious={showPrevious}
      status={messages.gradient.status.replace("{channel}", channelName).replace("{orientation}", orientationName)}
      surfaceLabel={messages.gradient.surface.replace("{channel}", channelName).replace("{orientation}", orientationName)}
      startEventName={testStartEventName("gradient")}
      controls={
        <>
          <div aria-label={messages.gradient.channelLabel} className={styles.toolGroup} role="group">
            {CHANNELS.map((item, index) => (
              <button
                aria-pressed={index === activeIndex}
                className={styles.toolButton}
                data-selected={index === activeIndex}
                key={item.name}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                {messages.gradient.channels[index]}
              </button>
            ))}
          </div>
          <div
            aria-label={messages.gradient.directionLabel}
            className={styles.toolGroup}
            role="group"
          >
            {(["horizontal", "vertical"] as const).map((option) => (
              <button
                aria-pressed={orientation === option}
                className={styles.toolButton}
                data-selected={orientation === option}
                key={option}
                onClick={() => setOrientation(option)}
                type="button"
              >
                {option === "horizontal" ? messages.gradient.horizontal : messages.gradient.vertical}
              </button>
            ))}
          </div>
        </>
      }
    >
      <div
        className={styles.gradientPattern}
        style={{ backgroundImage: `linear-gradient(${direction}, #000000, ${channel.end})` }}
      />
    </FullscreenTest>
  );
}
