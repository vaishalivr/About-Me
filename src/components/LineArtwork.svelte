<script>
  import { onMount } from 'svelte';
  import { scribblePath, landscapePath, scribbleSettings, scribbleExit } from '../scene.js';
  export let width;
  export let height;
  let svg;
  let measurement;
  let artworkPath = '';
  onMount(() => {
    const measure = () => {
      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
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
      const [exitHandleX, exitHandleY] = point(scribbleExit[0], scribbleExit[1] + 60);
      artworkPath = `M -30 490 C 90 490 ${entryX - 80} 490 ${entryX} 490 ${transformed} C ${exitHandleX} ${exitHandleY} 815 510 880 490 ${landscapePath}`;
    };
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    measure();
    return () => observer.disconnect();
  });
</script>
<svg bind:this={svg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true" style:--draw-delay={`${scribbleSettings.delayMs}ms`} style:--draw-duration={`${scribbleSettings.durationMs}ms`}>
  <path bind:this={measurement} d={`M 260 490 ${scribblePath}`} fill="none" stroke="none" />
  {#if artworkPath}
    <path class="thread" d={artworkPath} pathLength="1" fill="none" stroke="#171717" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
    <circle class="endpoint" cx="5970" cy="490" r="5" fill="#171717" />
  {/if}
</svg>
<style>
  svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .thread { stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; animation: draw var(--draw-duration) linear var(--draw-delay) forwards; }
  .endpoint { opacity: 0; animation: appear 1ms linear calc(var(--draw-delay) + var(--draw-duration)) forwards; }
  @keyframes draw { from { opacity: 1; stroke-dashoffset: 1; } to { opacity: 1; stroke-dashoffset: 0; } }
  @keyframes appear { to { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .thread { animation: none; opacity: 1; stroke-dashoffset: 0; }.endpoint { animation: none; opacity: 1; } }
</style>
