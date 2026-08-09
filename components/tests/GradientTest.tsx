"use client";

import { useCallback, useState } from "react";

import { FullscreenTest } from "./FullscreenTest";
import styles from "./ScreenTests.module.css";

const CHANNELS = [
  { name: "Neutral", end: "#ffffff" },
  { name: "Red", end: "#ff0000" },
  { name: "Green", end: "#00ff00" },
  { name: "Blue", end: "#0000ff" },
] as const;

type Orientation = "horizontal" | "vertical";

export function GradientTest() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const channel = CHANNELS[activeIndex];
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
      name="Gradient banding test"
      onNext={showNext}
      onPrevious={showPrevious}
      status={`${channel.name}, ${orientation}. Look for hard bands or sudden color jumps.`}
      surfaceLabel={`Full-screen ${orientation} ${channel.name.toLowerCase()} gradient from black`}
      controls={
        <>
          <div aria-label="Gradient channel" className={styles.toolGroup} role="group">
            {CHANNELS.map((item, index) => (
              <button
                aria-pressed={index === activeIndex}
                className={styles.toolButton}
                data-selected={index === activeIndex}
                key={item.name}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                {item.name}
              </button>
            ))}
          </div>
          <div
            aria-label="Gradient direction"
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
                {option === "horizontal" ? "Horizontal" : "Vertical"}
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
