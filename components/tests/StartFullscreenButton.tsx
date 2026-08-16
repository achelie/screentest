"use client";

import { Play } from "lucide-react";

import {
  testStartEventName,
  type FullscreenTestId,
} from "@/lib/test-events";
import styles from "./ScreenTests.module.css";

type StartFullscreenButtonProps = {
  label: string;
  slug: FullscreenTestId;
};

export function StartFullscreenButton({ label, slug }: StartFullscreenButtonProps) {
  const startTest = () => {
    document.querySelector(`#${slug}-tool`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    window.dispatchEvent(new Event(testStartEventName(slug)));
  };

  return (
    <button className={styles.startTestButton} onClick={startTest} type="button">
      <Play aria-hidden="true" size={18} strokeWidth={1.8} />
      {label}
    </button>
  );
}
