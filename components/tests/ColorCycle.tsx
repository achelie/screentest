"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { FullscreenTest } from "./FullscreenTest";
import { testStartEventName } from "@/lib/test-events";
import styles from "./ScreenTests.module.css";
import type { TestMessages } from "@/lib/test-messages";

type ColorCycleProps = {
  mode?: "dead-pixel" | "color";
  messages: Pick<TestMessages, "fullscreen" | "colorCycle">;
};

const DEAD_PIXEL_COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#ff0000" },
  { name: "Green", value: "#00ff00" },
  { name: "Blue", value: "#0000ff" },
] as const;

const COLOR_TEST_COLORS = [
  ...DEAD_PIXEL_COLORS,
  { name: "Cyan", value: "#00ffff" },
  { name: "Magenta", value: "#ff00ff" },
  { name: "Yellow", value: "#ffff00" },
] as const;

export function ColorCycle({ mode = "color", messages }: ColorCycleProps) {
  const colors = mode === "dead-pixel" ? DEAD_PIXEL_COLORS : COLOR_TEST_COLORS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [automatic, setAutomatic] = useState(false);
  const [intervalMs, setIntervalMs] = useState(1500);
  const activeColor = colors[activeIndex];

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => (current - 1 + colors.length) % colors.length);
  }, [colors.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % colors.length);
  }, [colors.length]);

  useEffect(() => {
    if (!automatic) {
      return;
    }

    const timer = window.setInterval(showNext, Math.max(1000, intervalMs));
    return () => window.clearInterval(timer);
  }, [automatic, intervalMs, showNext]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.visibilityState !== "visible") {
        setAutomatic(false);
      }
    };

    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  const chooseColor = (index: number) => {
    setAutomatic(false);
    setActiveIndex(index);
  };

  const name = mode === "dead-pixel" ? messages.colorCycle.deadPixelName : messages.colorCycle.colorName;
  const colorName = messages.colorCycle.colors[activeIndex];

  return (
    <FullscreenTest
      advanceOnSurfaceClick
      messages={messages.fullscreen}
      name={name}
      onNext={showNext}
      onPrevious={showPrevious}
      status={`${colorName}. ${automatic ? messages.colorCycle.cycling.replace("{seconds}", String(intervalMs / 1000)) : messages.colorCycle.manual}`}
      surfaceLabel={messages.colorCycle.surface.replace("{color}", colorName.toLowerCase())}
      startEventName={testStartEventName(mode === "dead-pixel" ? "dead-pixel" : "color")}
      controls={
        <>
          <div aria-label={messages.colorCycle.testColor} className={styles.toolGroup} role="group">
            {colors.map((color, index) => (
              <button
                aria-pressed={index === activeIndex}
                className={styles.toolButton}
                data-selected={index === activeIndex}
                key={color.name}
                onClick={() => chooseColor(index)}
                type="button"
              >
                {messages.colorCycle.colors[index]}
              </button>
            ))}
          </div>
          <div className={styles.toolGroup}>
            <button
              aria-pressed={automatic}
              className={styles.toolButton}
              data-selected={automatic}
              onClick={() => setAutomatic((current) => !current)}
              type="button"
            >
              {automatic ? (
                <Pause aria-hidden="true" size={17} strokeWidth={1.8} />
              ) : (
                <Play aria-hidden="true" size={17} strokeWidth={1.8} />
              )}
              {automatic ? messages.colorCycle.pause : messages.colorCycle.auto}
            </button>
            <label className={styles.selectWrap}>
              {messages.colorCycle.interval}
              <select
                className={styles.selectControl}
                onChange={(event) => setIntervalMs(Number(event.target.value))}
                value={intervalMs}
              >
                <option value={1000}>{messages.colorCycle.oneSecond}</option>
                <option value={1500}>{messages.colorCycle.onePointFiveSeconds}</option>
                <option value={2500}>{messages.colorCycle.twoPointFiveSeconds}</option>
              </select>
            </label>
          </div>
        </>
      }
    >
      <div
        className={styles.solidPattern}
        style={{ backgroundColor: activeColor.value }}
      />
    </FullscreenTest>
  );
}
