"use client";

import { useState } from "react";
import type { SamplerMessages } from "@/lib/i18n";

const samples = [
  { name: "Black", value: "#111111", ink: "#f7f3ea" },
  { name: "White", value: "#ffffff", ink: "#111111" },
  { name: "Red", value: "#d82727", ink: "#ffffff" },
  { name: "Green", value: "#18814b", ink: "#ffffff" },
  { name: "Blue", value: "#1762b1", ink: "#ffffff" },
  { name: "Gray", value: "#7f7f7f", ink: "#ffffff" },
] as const;

export function ScreenSampler({ messages }: { messages: SamplerMessages }) {
  const [active, setActive] = useState(0);
  const sample = samples[active];

  return (
    <div className="screen-sampler" aria-label={messages.label}>
      <div className="sampler-rail">
        <span>{messages.panelSample} / {messages.colors[active]}</span>
        <span className="sampler-status">
          <span className="status-dot" aria-hidden="true" /> {messages.live}
        </span>
      </div>
      <div className="sampler-canvas-wrap">
        <div
          className="sampler-canvas"
          style={{ backgroundColor: sample.value }}
        >
          <span className="sampler-coordinate" style={{ color: sample.ink }}>
            x: 50% / y: 50%
          </span>
        </div>
      </div>
      <div className="swatch-row" aria-label={messages.previewColors}>
        {samples.map((item, index) => (
          <button
            key={item.name}
            className="swatch-button"
            type="button"
            aria-label={messages.showSample.replace("{color}", messages.colors[index].toLowerCase())}
            aria-pressed={index === active}
            onClick={() => setActive(index)}
            style={{ backgroundColor: item.value, color: item.ink }}
          />
        ))}
      </div>
    </div>
  );
}
