"use client";

import { FullscreenTest } from "./FullscreenTest";
import styles from "./ScreenTests.module.css";
import type { TestMessages } from "@/lib/test-messages";

export function BacklightBleedTest({ messages }: { messages: Pick<TestMessages, "fullscreen" | "backlight"> }) {
  return (
    <FullscreenTest
      messages={messages.fullscreen}
      name={messages.backlight.name}
      status={messages.backlight.status}
      surfaceLabel={messages.backlight.surface}
      controls={
        <div className={styles.guidedPrompt}>
          <strong>{messages.backlight.title}</strong>
          <span>{messages.backlight.detail}</span>
        </div>
      }
    >
      <div className={styles.solidPattern} style={{ backgroundColor: "#000000" }} />
    </FullscreenTest>
  );
}
