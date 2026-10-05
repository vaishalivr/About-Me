# Thread

Svelte 5 + Vite horizontal storytelling with a fixed, continuous SVG path and real HTML scene items.

Run `npm install` and `npm run dev`. Validate with `npm run check`, `node --test tests/journey.test.js`, and `npm run build`.

## Editable settings

All scene settings live in `src/scene.js`:

- `scene.opening.startDelayMs`: 30ms after page load, Svelte mounting, dimensions, and SVG readiness. The first animation update is on the next available animation frame.
- `scene.opening.durationMs`: 5000ms. A five-second opening gives time to watch the separate three-second drawing effect and follow roughly 1068px of horizontal movement at 1440×900. Opening easing is cubic smoothstep in `src/journey.js`, with zero velocity at both ends.
- `scene.opening.endpointX`: 1190, an SVG coordinate just after the scribble exit bridge. `viewportAnchor`: .25 places that coordinate one quarter of the viewport width from the left. Actual horizontal opening distance is `endpointX * compositionWidth / scene.width - viewportWidth * viewportAnchor`, clamped to journey bounds and recalculated on resize.
- `scene.scrollDistanceMultiplier`: 1.5. After autoplay, 1.5px of vertical scrolling produces 1px of horizontal travel. There is no interpolation lag or time-based continuation.
- `scene.width`, `height`, and `minimumScreens`: composition coordinates and minimum horizontal length (five viewport widths).
- `baseScribble`, `tangleLoops`, and `extraLoops`: explicit, editable SVG Bézier coordinates. Original oval passes 2, 3, and 5 were removed from `extraLoops`, retaining passes 1, 4, and 6 and every uneven tangle. Outer bounds, entry, and final exit are preserved; retained join handles match vertically.
- `scribbleSettings`: center shift, 3rem diameter enlargement, and **independent stroke drawing** delay (30ms) and duration (3000ms). Drawing uses linear CSS animation; changing opening settings does not change drawing.
- `scene.items`: IDs, x/y coordinates, text, and reveal timing. `reveal.start`/`end` are fractions of viewport width; `offsetRem` is upward reveal distance. Set `showPlaceholders: false` to remove demonstration items.

## Motion and handoff

Previously, horizontal movement was entirely scroll-driven: 1.5px vertical → 1px horizontal. Scroll events were coalesced to the next animation frame, without easing delay. The only autoplay was the separate stroke reveal, drawing the complete line over three seconds after a 30ms delay.

The new controller has waiting, opening, scroll, and still phases. During waiting/opening, native scroll is temporarily held; wheel, touch scrolling, and scroll keys are discarded. Buttons remain operable. Programmatic scroll is also rebased so input cannot accumulate and cause a handoff jump. Autoplay animates the composition transform, leaving its SVG shape fixed. It stops at the configured endpoint, restores native scrolling, and does not replay when scrolling backward or returning from still view.

Remaining horizontal travel is `compositionWidth - viewportWidth - openingEnd`. Section height is that remaining travel times the scroll multiplier, plus viewport height. Subsequent travel is `openingEnd + clamp((scrollY - scrollAnchor) / multiplier, 0, remainingTravel)`. Reverse scrolling stops at the scribble endpoint. Resize preserves autoplay progress or normalized remaining-journey progress while recalculating geometry. Native touch and keyboard scrolling resume after autoplay.

Reduced-motion preferences skip autoplay and use a static overview with text in document flow. Selecting Scroll experience explicitly starts at the endpoint without autoplay; CSS also skips stroke drawing. Switching preference or selecting Still view during autoplay cancels timers/frames and restores scroll access. All observers, listeners, pending timers/frames, and altered overflow styles are cleaned up on destruction.

## Components

- `ScrollJourney.svelte`: readiness, autoplay, native-scroll handoff, responsive sizing, accessibility.
- `LineArtwork.svelte`: fixed SVG, non-scaling 2px stroke, measurement/readiness callback, independent drawing animation.
- `SceneItems.svelte`: HTML items and reversible scroll-position reveals.
- `journey.js`: geometry and opening easing.

Extend the item configuration and SceneItems renderer with images or illustrations, keeping positions on the outer article in shared composition coordinates.

## Verification

Svelte diagnostics, production build, and geometry/easing tests pass. Local browser checks cover readiness delay, autoplay endpoint and stop, discarded wheel/key/programmatic input, forward/reverse mapping, no replay, resizing during/after autoplay, final alignment, mobile layout, reduced motion, and cancellation via Still view.
