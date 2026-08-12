"use client";

import { Play } from "lucide-react";

import { DEAD_PIXEL_START_EVENT } from "@/lib/test-events";
import styles from "./ScreenTests.module.css";

export function StartFullscreenButton() {
  const startTest = () => {
    document.querySelector("#dead-pixel-tool")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    window.dispatchEvent(new Event(DEAD_PIXEL_START_EVENT));
  };

  return (
    <button className={styles.startTestButton} onClick={startTest} type="button">
      <Play aria-hidden="true" size={18} strokeWidth={1.8} />
      Start Dead Pixel Test
    </button>
  );
}
