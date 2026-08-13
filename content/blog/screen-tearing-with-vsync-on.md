---
title: "Screen Tearing With VSync On? Check These Settings in Order"
description: "Still seeing screen tearing with VSync on? Check refresh rate, driver conflicts, VRR limits, window mode, and frame generation in the right order."
author: "ScreenTestHub Team"
category: "Gaming & motion"
published: "2026-08-13"
updated: "2026-08-13"
cover: "/blog/screen-tearing-with-vsync-on.webp"
coverAlt: "Monitor showing a horizontal tearing seam beside a VSync On switch and timing controls"
ctaTitle: "Check whether the line is really tearing."
ctaDescription: "Run the moving stripe test in fullscreen, then compare one sync setting at a time."
ctaLabel: "Open screen tearing test"
ctaHref: "/screen-tearing-test"
---

Screen tearing with VSync on usually means VSync is applied in the wrong place, or another setting is bypassing it. Check the Windows refresh rate, driver override, VRR range, window mode, and frame generation before changing hardware.

Before changing anything, make sure the fault is a horizontal split. A whole-screen pause is stutter. A trail behind an object is ghosting. If you are unsure, run the [screen tearing test](/screen-tearing-test) and watch the fast vertical stripes in fullscreen. A browser cannot certify G-Sync or FreeSync, but it gives you a consistent pattern for comparison.

## Confirm Windows is using the refresh rate you selected

Windows must actually output the refresh rate you expect, so check that first. Open Advanced display, select the monitor where the game runs, and confirm both the chosen refresh rate and resolution. Then check the GPU control panel.

This setting is easy to miss. In one [r/buildapc discussion](https://www.reddit.com/r/buildapc/comments/uhhfem/running_games_in_fullscreen_has_weird/), a user saw jitter and tearing in fullscreen on a 4K 144 Hz setup. The first reply asked whether NVIDIA Control Panel was actually set to 144 Hz. The user confirmed that it was, so the check did not solve that case, but it ruled out the mismatch quickly.

Do not assume a frame counter proves this setting is correct. A game can render 144 frames per second while the display output is still set to 60 Hz.

## Let either the game or driver control VSync

Use one VSync switch at a time. First leave the driver application-controlled and enable VSync in the game. If that tears, reverse the two settings and restart the game.

Neither location always wins. In an [r/techsupport thread](https://www.reddit.com/r/techsupport/comments/1lucnp4/screen_tearing_with_v_sync_enabled/), the poster still saw tearing after enabling VSync and was comparing the game switch with the NVIDIA Control Panel override. That is the useful part of the report: test the two paths separately instead of assuming both switches do the same job.

Write down each combination. If you toggle both menus repeatedly and cannot remember what changed, the test has stopped telling you anything.

## Keep G-Sync or FreeSync inside its working range

VRR can stop covering frame delivery at or above its upper refresh limit. While testing, cap the frame rate a few frames below that limit to leave some headroom. Do not copy one universal number from a forum because displays, games, and limiters differ.

One [r/techsupport post](https://www.reddit.com/r/techsupport/comments/19bzlw4/annoying_screen_tearing_even_with_gsync_and_vsync/) described tearing with G-Sync, VSync, and a 141 FPS cap on a 144 Hz monitor. A reply asked whether the display's working G-Sync range was narrower than the number on the box. That does not prove the range caused the problem, but it is a better question than endlessly lowering the cap.

Check VRR in the monitor menu and GPU driver. For a borderless game, windowed VRR support also depends on Windows and how that game presents frames. Then watch the game's frame-time graph if it has one. Large spikes can look like a sync failure even when delivery is simply uneven.

## Compare exclusive fullscreen with borderless mode

If tearing changes between fullscreen and borderless, the presentation path is part of the problem. Test both modes at the same resolution and refresh rate instead of treating the window mode as a performance preference.

Borderless mode can use a different Windows presentation path from exclusive fullscreen, so the same frames may be synchronized differently. Modern games and Windows versions do not all behave the same way. An [Elden Ring player](https://www.reddit.com/r/Eldenring/comments/t0pebu/terrible_screen_tearing_and_frame_rate_on_pc_fix/) reported that borderless fixed severe tearing at a locked 60 FPS. Treat that as a useful comparison, not proof that borderless always fixes tearing.

If only one mode fails, keep that result. It is more useful than another hour of random driver changes.

## Treat frame generation as a separate timing system

Frame generation may expose tearing or change frame pacing in a setup that looked clean without it. Turn it off, leave every other setting alone, and compare.

The type of frame generation matters. In a [Cyberpunk 2077 discussion](https://www.reddit.com/r/cyberpunkgame/comments/16t4w6b/frame_generation_tearing_here_is_the_fix/), the poster said the usual VSync and FPS-cap advice had not solved tearing with the game's frame generation. A [Lossless Scaling thread](https://www.reddit.com/r/losslessscaling/comments/1gns6fn/lossless_scaling_is_constantly_tearing_even_with/) describes a similar symptom with an external frame-generation tool. Those are different pipelines, so a cap may act on a different stage in each one.

Use the game's recommended setup, then verify it in that game. Advice written for normal rendering may target the wrong frame rate once generated frames are added.

## Rule out stutter and ghosting before changing more settings

Tearing is a horizontal offset. A full-scene hitch is stutter, while a smeared edge points to ghosting. Make that distinction before installing a new driver or buying a cable.

Run the [monitor ghosting test](/tests/motion) if moving objects leave a dark trail or bright halo. Use the [guided monitor test](/tests/guided) if the symptom also appears in gradients, solid colors, or static scenes. When the whole image freezes for a fraction of a second, inspect frame time, shader compilation, storage activity, and background tasks rather than chasing VSync.

Browsers normally synchronize their own compositor, so a clean web test cannot prove a game uses the same timing path. The test helps you recognize the shape of the fault. Repeat the comparison in the game where you noticed it.

## A clean test order that does not waste an evening

Change one variable per run and keep the order fixed. This is slower than flipping five switches at once, but it produces an answer.

1. Confirm the correct monitor, native resolution, and Windows refresh rate.
2. Turn frame generation off.
3. Test in-game VSync with the driver set to application controlled.
4. Test driver VSync with in-game VSync off.
5. If using VRR, verify its monitor and driver settings, then apply a sensible cap below the upper boundary.
6. Compare fullscreen and borderless at identical display settings.
7. Restore frame generation and test again only after the normal path is stable.

Record the mode, cap, and result in a note. The boring method wins here because it shows which layer caused the change.

## FAQ

Short answer: VSync can still tear when the wrong layer controls it, VRR reaches its upper limit, or frame generation changes delivery timing.

### Why do I still get screen tearing with VSync on?

VSync may be enabled in a menu that does not control the active presentation path. Conflicting driver settings, an incorrect Windows refresh rate, a VRR boundary, window mode, or frame generation can all change the result.

### Should VSync be on in the game or GPU control panel?

Test one authority at a time. Start with in-game VSync and an application-controlled driver setting, then try driver VSync with the game option off if the first setup fails. Restart the game between tests.

### Can screen tearing happen below the monitor refresh rate?

Yes. If synchronization is disabled or bypassed, a frame can arrive during scanout even when average FPS is below the refresh rate. A matching FPS number is not the same thing as synchronized presentation.

### Why does borderless mode fix tearing?

Borderless mode can use a different presentation or composition path. The result depends on Windows, the game, the driver, and whether the game is eligible for modern flip-model behavior.

### Does G-Sync or FreeSync replace VSync?

Not always. VRR adjusts the display inside its supported range. VSync can still control tearing at the range boundary, but the exact behavior depends on the game and driver.

### Can an online test prove that VSync or VRR is working?

No. A browser can show repeatable motion and help you identify a horizontal seam, but its compositor usually synchronizes page animation. Verify the final setup in the game or application where tearing occurs.
