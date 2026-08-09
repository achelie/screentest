"use client";

import { useEffect, useRef } from "react";

import styles from "./ScreenTests.module.css";

type MovingTargetProps = {
  running: boolean;
  speed: number;
};

export function MovingTarget({ running, speed }: MovingTargetProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const travelledRef = useRef(0);
  const distanceRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    const target = targetRef.current;

    if (!track || !target) {
      return;
    }

    const measureDistance = () => {
      distanceRef.current = Math.max(track.clientWidth - target.offsetWidth, 0);
    };

    measureDistance();

    const resizeObserver = new ResizeObserver(measureDistance);
    resizeObserver.observe(track);
    resizeObserver.observe(target);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!running) {
      lastTimeRef.current = null;
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return;
    }

    const animate = (time: number) => {
      const track = trackRef.current;
      const target = targetRef.current;

      if (!track || !target) {
        return;
      }

      if (document.visibilityState === "visible") {
        const lastTime = lastTimeRef.current ?? time;
        const elapsedSeconds = Math.min((time - lastTime) / 1000, 0.05);
        const distance = distanceRef.current;

        travelledRef.current += speed * elapsedSeconds;

        if (distance > 0) {
          const cycle = travelledRef.current % (distance * 2);
          const position = cycle <= distance ? cycle : distance * 2 - cycle;
          target.style.transform = `translate3d(${position}px, -50%, 0)`;
        }
      }

      lastTimeRef.current = time;
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastTimeRef.current = null;
    };
  }, [running, speed]);

  return (
    <div className={styles.motionStage}>
      <div className={styles.motionTrack} ref={trackRef}>
        <div aria-hidden="true" className={styles.motionTarget} ref={targetRef}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
