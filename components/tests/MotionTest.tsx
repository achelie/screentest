"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { FullscreenTest } from "./FullscreenTest";
import { testStartEventName } from "@/lib/test-events";
import { MovingTarget } from "./MovingTarget";
import styles from "./ScreenTests.module.css";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const SPEEDS = [240, 480, 960] as const;

export function MotionTest() {
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
        name="Motion and ghosting test"
        onNext={faster}
        onPrevious={slower}
        status={`${running ? "Running" : "Paused"} at ${speed} px/s.`}
        surfaceLabel={`Moving high-contrast target at ${speed} pixels per second`}
        startEventName={testStartEventName("motion")}
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
              {running ? "Pause target" : "Start target"}
            </button>
            <div aria-label="Target speed" className={styles.toolGroup} role="group">
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
          Motion is paused because your device requests reduced motion. Start it
          only when you are ready for a moving test pattern.
        </p>
      ) : null}
    </>
  );
}
