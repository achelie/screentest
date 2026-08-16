"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { FullscreenTest } from "./FullscreenTest";
import { MovingTarget } from "./MovingTarget";
import styles from "./ScreenTests.module.css";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import type { TestMessages } from "@/lib/test-messages";

const SPEEDS = [240, 480, 960] as const;

export function MotionTest({ messages }: { messages: Pick<TestMessages, "fullscreen" | "motion"> }) {
  const [speedIndex, setSpeedIndex] = useState(1);
  const [running, setRunning] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const speed = SPEEDS[speedIndex];

  const slower = useCallback(() => {
    setSpeedIndex((current) => (current - 1 + SPEEDS.length) % SPEEDS.length);
  }, []);

  const faster = useCallback(() => {
    setSpeedIndex((current) => (current + 1) % SPEEDS.length);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setRunning(false);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.visibilityState !== "visible") {
        setRunning(false);
      }
    };

    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  return (
    <>
      <FullscreenTest
        messages={messages.fullscreen}
        name={messages.motion.name}
        onNext={faster}
        onPrevious={slower}
        status={messages.motion.status.replace("{state}", running ? messages.motion.running : messages.motion.paused).replace("{speed}", String(speed))}
        surfaceLabel={messages.motion.surface.replace("{speed}", String(speed))}
        controls={
          <>
            <button
              aria-pressed={running}
              className={styles.toolButton}
              data-selected={running}
              onClick={() => setRunning((current) => !current)}
              type="button"
            >
              {running ? (
                <Pause aria-hidden="true" size={17} strokeWidth={1.8} />
              ) : (
                <Play aria-hidden="true" size={17} strokeWidth={1.8} />
              )}
              {running ? messages.motion.pause : messages.motion.start}
            </button>
            <div aria-label={messages.motion.speedLabel} className={styles.toolGroup} role="group">
              {SPEEDS.map((option, index) => (
                <button
                  aria-pressed={index === speedIndex}
                  className={styles.toolButton}
                  data-selected={index === speedIndex}
                  key={option}
                  onClick={() => setSpeedIndex(index)}
                  type="button"
                >
                  {option} px/s
                </button>
              ))}
            </div>
          </>
        }
      >
        <MovingTarget running={running} speed={speed} />
      </FullscreenTest>

      {prefersReducedMotion ? (
        <p className={styles.inlineNotice}>
          {messages.motion.reduced}
        </p>
      ) : null}
    </>
  );
}
