# Thread

Svelte 5 + Vite horizontal storytelling with a fixed, continuous SVG path and real HTML scene items.

Run `npm install` and `npm run dev`. Validate with `npm run check`, `node --test tests/journey.test.js`, and `npm run build`.

## Editable settings

All scene settings live in `src/scene.js`:

- `scene.scrollDistanceMultiplier`: 1.5px of vertical scrolling produces 1px of horizontal travel.
- `scene.lineRevealStops`: set the visible portion of the remaining line at specific scroll positions. Both `scroll` and `visible` are fractions from 0 to 1. For example, `{ scroll: 0.25, visible: 0.6 }` reveals 60% of the post-scribble line at 25% of the scroll journey. Add stops in increasing `scroll` order; values interpolate smoothly between them. Keep the first and last stops at `{ scroll: 0, visible: 0 }` and `{ scroll: 1, visible: 1 }` to start at the scribble and finish with the full line. Horizontal movement and scribble timing are independent of these settings.
- `scene.width`, `height`, and `minimumScreens`: composition coordinates and minimum horizontal length (five viewport widths).
- `baseScribble`, `tangleLoops`, and `extraLoops`: explicit, editable SVG Bézier coordinates. Original oval passes 2, 3, and 5 were removed from `extraLoops`, retaining passes 1, 4, and 6 and every uneven tangle. Outer bounds, entry, and final exit are preserved; retained join handles match vertically.
- `scribbleSettings`: center shift and 3rem diameter enlargement. The line starts 300ms after page load; `delayMs` and `durationMs` independently configure the delay and opening duration (currently 6000ms). The opening ends at the measured length of the transformed scribble, before the exit bridge.
- `scene.items`: IDs, x/y coordinates, text, and reveal timing. `reveal.start`/`end` are fractions of viewport width; `offsetRem` is upward reveal distance. Set `showPlaceholders: false` to remove demonstration items.

## Scrolling

The introduction places “Hi, I'm” above the start circle and “Vaishali Verma” below it, with shared alignment in the composition. During the opening, the section occupies one viewport, so scroll input cannot advance the horizontal journey or compete with the drawing animation. When the scribble finishes, the section expands to expose the native scroll range. Horizontal movement then responds only to native scrolling. Section height covers the full horizontal distance times the scroll multiplier, plus viewport height. Scroll events update the artwork on the next animation frame. One normalized dash offset reveals the full predefined path: automatic progress covers the start-to-scribble prefix, and horizontal scroll progress covers the remaining bridge and landscape. Stopping scroll pauses reveal, reversing hides the remaining line, and reaching the end reveals everything. Resizing measures the actual opening/full path length ratio again.

Reduced-motion preferences use a static overview with text in document flow. The Still view button also selects this overview. Resizing recalculates geometry from the current scroll position without programmatic scrolling.

## Components

- `ScrollJourney.svelte`: manual scrolling, responsive sizing, accessibility.
- `LineArtwork.svelte`: fixed SVG, non-scaling 2px stroke, measured scribble boundary, opening animation, and reversible scroll reveal.
- `SceneItems.svelte`: HTML items and reversible scroll-position reveals.
- `journey.js`: scroll geometry.

Extend the item configuration and SceneItems renderer with images or illustrations, keeping positions on the outer article in shared composition coordinates.

## Verification

Run Svelte diagnostics, the production build, and the geometry tests using the commands above.
