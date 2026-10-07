<script>
  import { onMount, tick } from 'svelte';
  import { scene, scribblePath, landscapePath, scribbleSettings, scribbleExit } from '../scene.js';
  import { lineRevealAt } from '../journey.js';
  export let width;
  export let height;
  export let progress = 0;
  export let still = false;
  let thread;
  let openingMeasurement;
  let openingPath = '';
  let boundary = 0;
  let opening = 0;
  let finished = false;
  export let onOpeningComplete = () => {};
  $: remaining = finished
    ? lineRevealAt(progress, scene.lineRevealStops)
    : 0;
  $: revealed = still ? 1 : finished ? boundary + (1 - boundary) * remaining : boundary * opening;
  let svg;
  let measurement;
  let artworkPath = '';
  let dotRadiusX = 5;
  let dotRadiusY = 5;
  onMount(() => {
    let alive = true;
    let animationFrame = 0;
    let startTime;
    const animate = (now) => {
      if (!alive) return;
      if (startTime === undefined) startTime = now;
      opening = Math.max(0, Math.min(1, (now - startTime - scribbleSettings.delayMs) / scribbleSettings.durationMs));
      if (opening === 1) {
        finished = true;
        onOpeningComplete();
      } else animationFrame = requestAnimationFrame(animate);
    };
    const start = () => { startTime = performance.now(); animationFrame = requestAnimationFrame(animate); };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    const measure = () => {
      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dotRadiusX = 5 * width / rect.width;
      dotRadiusY = 5 * height / rect.height;
      const bounds = measurement.getBBox();
      const extraPixels = scribbleSettings.extraDiameterRem * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const sx = 1 + extraPixels / (rect.width / width) / bounds.width;
      const sy = 1 + extraPixels / (rect.height / height) / bounds.height;
      const point = (x, y) => [520 + (x - 520) * sx + scribbleSettings.shiftX, 490 + (y - 490) * sy];
      // C commands contain only coordinate pairs, so this deterministic edit
      // scales the editable scribble without changing the landscape path.
      let axis = 0;
      const transformed = scribblePath.replace(/-?\d+(?:\.\d+)?/g, (value) => {
        const isX = axis++ % 2 === 0;
        return (isX ? point(Number(value), 490)[0] : point(520, Number(value))[1]).toFixed(3);
      });
      const [entryX] = point(260, 490);
      const [exitHandleX, exitHandleY] = point(scribbleExit[0], scribbleExit[1] + 80);
      openingPath = `M 30 490 C 90 490 ${entryX - 80} 490 ${entryX} 490 ${transformed}`;
      artworkPath = `${openingPath} C ${exitHandleX} ${exitHandleY} 1020 525 1190 490 ${landscapePath}`;
      tick().then(() => { if (alive) boundary = openingMeasurement.getTotalLength() / thread.getTotalLength(); });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    measure();
    return () => { alive = false; observer.disconnect(); cancelAnimationFrame(animationFrame); window.removeEventListener('load', start); };
  });
</script>
<svg bind:this={svg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
  <ellipse class="start-point" cx="30" cy="490" rx={dotRadiusX} ry={dotRadiusY} fill="#171717" />
  <path bind:this={measurement} d={`M 260 490 ${scribblePath}`} fill="none" stroke="none" />
  <path bind:this={openingMeasurement} d={openingPath} fill="none" stroke="none" />
  {#if artworkPath}
    <path bind:this={thread} data-boundary={boundary} data-reveal={revealed} data-phase={finished ? "scroll" : "opening"} style:stroke-dasharray="1 1" style:stroke-dashoffset={1 - revealed} class="thread" d={artworkPath} pathLength="1" fill="none" stroke="#171717" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
    <ellipse class="endpoint" style:opacity={revealed >= 1 ? 1 : 0} cx="5970" cy="490" rx={dotRadiusX} ry={dotRadiusY} fill="#171717" />
  {/if}
</svg>
<style>
  svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
</style>
