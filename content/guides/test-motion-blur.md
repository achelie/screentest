---
title: "How to Test Motion Blur and Pixel Response"
description: "Check moving edges at several speeds and tell pixel response blur apart from refresh rate limits and overshoot."
published: "2026-08-09"
updated: "2026-08-09"
order: 4
---

Motion blur on a display has more than one cause. The panel may change pixels slowly, the refresh rate may be low, or an aggressive overdrive setting may create a bright trail behind moving objects.

## Match the display refresh rate

Open your system display settings and confirm the screen is using the refresh rate you paid for. A 144 Hz monitor running at 60 Hz will look worse before the test even begins.

Close video capture tools and heavy downloads. They can cause frame drops that look like a panel problem.

## Run the moving target

Open the [motion test](/tests/motion) in fullscreen. Start with a moderate speed. Track the object with your eyes, then look at a fixed point while it passes.

Increase the speed one step at a time. A soft trailing edge suggests slow pixel response. A bright or dark halo on the opposite edge often points to overdrive overshoot.

## Compare overdrive settings

If the monitor has response time or overdrive controls, test each level at the same speed. Names like Fast and Extreme are marketing labels, not measurements.

The highest setting is often not the cleanest. Choose the level with the shortest trail and the least visible halo. Repeat at a lower refresh rate if you use variable refresh rate, since one overdrive mode may not suit the whole range.

## Check dark transitions

VA panels can show extra smearing when dark shades move across a dark background. Test a dark target on middle gray, then a middle gray target on near black. Keep room lighting normal so your eyes do not overreact to tiny changes.

## Know the limit of a browser test

A browser test is good for side-by-side settings and obvious artifacts. It does not replace a high-speed camera or instrumented response measurement. Browser timing, frame delivery, and the operating system can all affect the result.

Use the test to pick the cleanest setting for your own games and videos. If trails remain severe at the correct refresh rate and every overdrive level, save a short slow-motion phone video and contact the seller.
