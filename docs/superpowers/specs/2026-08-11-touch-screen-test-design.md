# Touch Screen Test Page Design

## Goal

Create a static-first SEO landing page at `/touch-screen-test/` that lets phone, tablet, Chromebook, and touchscreen-laptop users find dead zones, missed swipes, ghost input, and multi-touch limitations directly in the browser.

Primary target queries:

- `touch screen test`
- `touch screen test online`
- `phone touch test`
- `touchscreen checker`

The page must follow this exact visible order:

1. H1
2. Start Test
3. Tool
4. How to use
5. What to look for
6. FAQ
7. Related tools

## Design Read

This is a focused SEO utility page for phone and tablet owners, using ScreenTestHub's existing tactile laboratory language. It is a preserve-style extension, not a visual redesign.

- `DESIGN_VARIANCE: 5`
- `MOTION_INTENSITY: 3`
- `VISUAL_DENSITY: 6`
- Foundation: existing Next.js, Tailwind v4, semantic CSS tokens, and Lucide icon family
- Theme: existing automatic light and dark modes
- Accent: existing burnt orange token only
- Shape rule: sharp diagnostic surfaces, with the existing button treatment

The selected tool layout is **Diagnostic bench**:

- Desktop: full touch grid plus a fixed-width diagnostic side rail.
- Mobile: diagnostic metrics move above the grid so the touch area remains wide.
- Result: coverage, missed cells, and maximum simultaneous touches are summarized below the tool.

## Above-the-Fold Content

The hero remains compact and left aligned. It contains only the H1, one short sentence, and one primary action.

- H1: `Touch Screen Test Online`
- Supporting sentence: `Check every part of your phone, tablet, or touchscreen laptop for missed taps and broken touch paths.`
- Primary action: `Start Touch Test`

The H1 uses a maximum size of 52px on large screens and 36px on phones. The tool begins immediately below the action and remains visible within the first viewport on common phone sizes.

## Tool Experience

### State Model

The tool has three primary states:

1. `idle`: instructions, device capability note, and Start Touch Test action.
2. `active`: fullscreen or in-page diagnostic bench with live grid painting and multi-touch metrics.
3. `result`: coverage summary, missed-cell map, maximum simultaneous touches, reset, and PNG download.

Recoverable errors remain inside the current state and never replace the whole page.

### Active Desktop Layout

- Canvas grid fills the available test area.
- A 160px to 180px side rail shows coverage, live touches, peak touches, Reset, and Finish.
- Active touch points appear as high-contrast circles over the grid.
- Grid cells change from neutral to the existing accent when covered.
- Missed cells stay neutral and remain visible in the result.

### Active Mobile Layout

- Coverage, live touches, and peak touches form a compact three-cell strip above the grid.
- Reset, Fullscreen, and Finish form a compact control strip below the grid.
- The grid uses the full remaining width and height.
- Portrait and landscape changes pause the test and ask the user to restart, because changing the grid geometry would invalidate the coverage map.

### Input and Grid Algorithm

The browser tool uses Pointer Events and a Canvas 2D rendering surface.

- `pointerdown` captures the pointer and adds its `pointerId` to an active pointer map.
- `pointermove` paints the grid and updates the touch-point overlay.
- `pointerup`, `pointercancel`, and lost pointer capture remove the pointer.
- The current touch count is the active pointer-map size.
- The peak touch count stores the largest active pointer-map size reached during the session.
- Grid coverage is stored as a set of cell indexes.
- Fast swipes are interpolated between the previous and current coordinates at intervals no larger than half a grid cell. This prevents false gaps caused by sparse pointer events.
- Canvas dimensions track the rendered element through `ResizeObserver` and use a capped device-pixel ratio for sharp output without excessive memory use.
- Continuous coordinates, active pointers, and painted cells live in refs. React state receives throttled summary updates at most once per animation frame.
- All pointer capture, animation frame, and resize observer resources are cleaned up when the component unmounts or the session ends.

The canvas uses `touch-action: none` only while the test is active. Normal page scrolling remains available outside the test.

### Multi-Touch Interpretation

The tool reports what the browser receives. It does not claim to certify the hardware.

- `Live touches` shows the current simultaneous pointers.
- `Peak touches` shows the largest simultaneous count observed.
- Some operating systems reserve gestures or limit pointer reporting.
- A lower count can indicate a device, browser, operating-system, or hardware limit.
- Unexpected touch points while the user's hands are off the screen can suggest ghost input, but the page must tell users to repeat the test before drawing a conclusion.

### Results and Download

Finish freezes the current result and keeps the painted canvas visible.

The result includes:

- Coverage percentage
- Painted and missed cell counts
- Maximum simultaneous touches
- A short interpretation of contiguous missed areas
- `Test Again` action
- `Download Result` action

PNG export is generated locally from the canvas. It includes the grid map, result values, page name, and test date. No file or touch data leaves the device.

## Error and Edge States

- Fullscreen unavailable or rejected: keep the tool in the page and show a short inline note.
- No touch capability reported: allow mouse testing, but label the result as a desktop preview rather than a phone touch result.
- No input before Finish: show `No touch data recorded` and keep Test Again available.
- Orientation or container-size change during a test: pause and request a restart.
- Tab hidden or focus lost: clear active pointers so stale touches do not remain counted.
- PNG generation failure: keep the result visible and show an inline retry message.
- Pointer cancellation: remove only the cancelled pointer and preserve completed coverage.

## Static Page Content

### How to Use

Use four direct instructions without numbered stage labels:

- Open the test and enter fullscreen when available.
- Slide one finger across the entire grid, including every edge and corner.
- Place several fingers on the screen to check simultaneous touch reporting.
- Finish the test and inspect any continuous blank area or broken path.

### What to Look For

Use an asymmetric observation layout rather than equal feature cards.

- **Continuous blank area:** the same cluster of cells stays untouched after repeated passes.
- **Broken swipe path:** a line repeatedly stops or skips in one location.
- **Unexpected points:** the tool receives input while the user's hands are off the screen.
- **Edge or corner misses:** taps near the bezel fail while the center works.
- **Multi-touch dropout:** live touch count falls below the number of fingers placed on the screen.

The limitation note must state that the tool observes browser input and cannot identify the failed physical component.

## FAQ

The FAQ questions come from patterns found in Reddit discussions about phone, tablet, handheld-console, and touchscreen-laptop failures. Answers are original, cautious summaries rather than copied comments.

### How can I find a touchscreen dead zone?

Run the grid twice and swipe slowly through every edge and corner. A dead zone is more likely when the same connected group of cells stays blank on both passes. Restart the device and repeat the test before assuming the digitizer is faulty.

### Can this test confirm ghost touch?

No browser test can prove the cause. If touch points appear while the screen is clean, dry, unplugged, and untouched, repeat the test after a restart. Persistent unexpected input across apps is a reason to contact the manufacturer or a repair technician.

### Can a screen protector cause ghost touches?

It can. Dirt, trapped moisture, lifting edges, cracks, or a poorly fitted protector can affect capacitive input. Clean and dry the screen first. If the issue continues, test without the protector only when it can be removed safely.

### Why does ghost touch happen only while charging?

Community reports often link charging-only input problems to a cable, charger, port, or grounding issue. Test while unplugged, then try a trusted charger and cable. Stop using any charger that becomes unusually hot, damaged, or electrically unsafe.

### Can water or damp fingers affect the result?

Yes. Water droplets and damp fingers can register as extra capacitive input or make swipes inconsistent. Dry the screen and hands completely before repeating the test.

### What should I do if the same area keeps failing?

Restart the device, remove the case if it presses on the display, clean the screen, and repeat the test unplugged. If the same area still fails in multiple apps, save the result and contact support or a repair technician.

### How many simultaneous touch points does my screen support?

Place several fingers on the grid and watch Peak touches. The displayed number is what the browser and operating system report during this session, which may be lower than the digitizer's advertised hardware maximum.

Research threads:

- https://www.reddit.com/r/S24Ultra/comments/1rfuena/ghost_touches_and_occasional_dead_zone/
- https://www.reddit.com/r/GalaxyA56/comments/1qrqpqb/touch_screen_dead_zone/
- https://www.reddit.com/r/Nintendo3DS/comments/1k11dui/my_touchscreen_has_this_weird_dead_zone_thing/
- https://www.reddit.com/r/phone/comments/1nmxk6b/phone_ghost_touches_should_i_remove_the_protector/
- https://www.reddit.com/r/PakistaniTech/comments/1uzarjg/ghost_touch_only_when_charging_is_this_charger/
- https://www.reddit.com/r/iPadPro/comments/hfupi3/my_touch_screen_goes_weird_when_the_charger_is/

## Related Tools

The page links to three existing tools with different jobs:

- Guided Screen Test: `/tests/guided`
- Dead Pixel Test: `/tests/dead-pixel`
- Monitor Color Test: `/tests/color`

The new route is added to the Tools menu, site route catalog, and sitemap.

## SEO

- Route: `/touch-screen-test/`
- Canonical: `https://screentesthub.com/touch-screen-test/`
- Metadata title: `Touch Screen Test Online - Phone Touchscreen Checker`
- Metadata description: `Run a free touch screen test online to find dead zones, ghost touches, missed swipes, and multi-touch issues on phones, tablets, and touchscreen laptops.`
- Open Graph URL: canonical URL
- Static generation: page body and SEO content render as a Server Component
- Client JavaScript: only the diagnostic tool hydrates
- Structured data: `WebApplication`, `FAQPage`, and `BreadcrumbList`
- FAQ answers render as normal HTML and match the JSON-LD wording
- Target terms appear naturally in the title, H1, introduction, instructions, FAQ, and internal links without keyword stuffing

## Component Boundaries

- `app/touch-screen-test/page.tsx`: metadata, static content, related links, and JSON-LD
- `components/touch/TouchScreenTest.tsx`: client state machine and accessible controls
- `components/touch/TouchGridCanvas.tsx`: canvas rendering and pointer lifecycle
- `components/touch/TouchScreenTest.module.css`: diagnostic bench, mobile collapse, and theme styling
- `lib/touch-grid.ts`: pure grid geometry, interpolation, coverage, and result helpers
- `lib/site.ts`: route catalog entry
- `app/sitemap.ts`: route discovery through the existing catalog, with an explicit entry only if the current implementation requires it

The canvas module exposes summary callbacks to the session component. The static page never imports browser-only APIs.

## Accessibility

- Start, Reset, Fullscreen, Finish, Test Again, and Download Result are native buttons.
- The canvas has an accessible label and a text summary next to it.
- Live metrics use a polite live region with throttled updates.
- Result values are available as text and do not depend on color.
- Focus returns to Start Touch Test after leaving fullscreen.
- Focus moves to the result heading after Finish.
- Touch circles and accent cells meet contrast requirements in both themes.
- The tool does not require motion. Reduced-motion users receive the same instant state changes.

## Performance and Cloudflare Compatibility

- No external API, database, server action, or Node-only runtime dependency is added.
- The page is statically generated and compatible with OpenNext on Cloudflare Workers.
- Canvas drawing happens on the client and avoids image assets or large animation libraries.
- Device-pixel ratio is capped to limit canvas memory on high-density phones.
- Touch data stays in memory and is discarded on navigation or reset.

## Testing

Pure helper tests cover:

- Grid coordinate to cell-index mapping
- Boundary clamping
- Fast-path interpolation through every crossed cell
- Coverage percentage
- Multiple pointer peak-count calculation

Use Node 22's built-in test runner for pure TypeScript helpers so no runtime dependency is added.

Browser verification covers:

- Start to active to result lifecycle
- Mouse fallback
- Two simultaneous pointer IDs
- Pointer cancellation cleanup
- Fullscreen rejection fallback
- Orientation or resize reset
- PNG download
- Keyboard focus restoration
- 390px mobile layout
- Desktop diagnostic side rail
- Light and dark themes
- Console errors

Release validation remains:

- `npm run typecheck`
- `npm run build`
- `npm run preview`
- Live route, canonical, FAQ schema, sitemap, and robots verification after deployment

## Out of Scope

- Hardware certification
- Identifying the exact failed digitizer component
- Pressure calibration across device brands
- Stylus-specific diagnostics
- Saving touch results to a server
- User accounts or result history
- A separate multi-touch-only route
