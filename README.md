# Thread

A Svelte 5 + Vite horizontal storytelling experience.

## Run

`npm install`, then `npm run dev`. Use `npm run check` and `npm run build` to validate and produce the static site in `dist`.

## Edit the journey

- **Line and scribble:** `src/scene.js`, `linePath`. One explicit SVG path makes the joins continuous. Coordinates are in the shared 6000 × 900 scene. No random generation or drawing animation.
- **Composition length:** `scene.width` and `scene.minimumScreens` in that same file. The latter guarantees five screens (four complete viewport lengths of travel). If you change the artwork coordinate width, also update its final endpoint in `LineArtwork.svelte`.
- **Text positions:** `scene.items` uses `id`, `x`, and `y` in SVG scene coordinates. Both HTML and SVG use the same proportional placement.
- **Reveal timing:** each item's `reveal.start` and `reveal.end` are viewport fractions: 0.94 begins as the anchor enters near the right edge; 0.66 completes farther inside. `offsetRem` controls the upward entrance distance. Opacity and movement derive directly from scroll position, so scrolling back reverses them.
- **Remove placeholders:** set `showPlaceholders: false`, or delete individual entries from `items`.
- **Opening text/chrome:** `src/components/ScrollJourney.svelte`. Remove `.opening-note` for an artwork-only opening.
- **Add images or illustrations:** extend the item configuration and `SceneItems.svelte` with an item type and corresponding HTML. Keep positioning on its outer article.

## Components and behavior

`ScrollJourney.svelte` measures the viewport and composition and pins the scene. Vertical travel is exactly `compositionWidth - viewportWidth`. Its section height is this distance plus the viewport height, placing the start and end correctly. A passive scroll listener schedules a single animation frame; it applies scroll position without easing lag, snapping, or wheel interception. Native touch and keyboard scrolling work. ResizeObserver, resize, and media-query changes recalculate dimensions; all listeners, observers, and pending frames are cleaned up on destruction.

`LineArtwork.svelte` renders the fixed SVG artwork with a non-scaling 2px stroke. `SceneItems.svelte` renders real HTML and scroll-based reveals.

Reduced-motion preferences automatically select a static overview with readable text in document flow. The Still view button provides the same alternative manually. This avoids a long pinned sideways animation rather than merely slowing it down. A reduced-motion device can explicitly select the scroll experience with the view button.
