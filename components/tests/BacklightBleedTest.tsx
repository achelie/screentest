"use client";

import { FullscreenTest } from "./FullscreenTest";
import styles from "./ScreenTests.module.css";

export function BacklightBleedTest() {
  return (
    <FullscreenTest
      name="Backlight bleed test"
      status="Black pattern. Hide the controls for a clean edge check."
      surfaceLabel="Full-screen pure black backlight bleed pattern"
      controls={
        <div className={styles.guidedPrompt}>
          <strong>Look straight at the panel</strong>
          <span>
            Brightness at your normal level is more useful than forcing it to
            100%.
          </span>
        </div>
      }
    >
      <div className={styles.solidPattern} style={{ backgroundColor: "#000000" }} />
    </FullscreenTest>
  );
}
