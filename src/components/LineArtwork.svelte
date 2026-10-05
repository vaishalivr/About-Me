<script>
  import { linePath } from '../scene.js';
  export let width;
  export let height;
</script>
<svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
  <path d={linePath} fill="none" stroke="#171717" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
  <circle cx="5970" cy="490" r="5" fill="#171717" />
</svg>
<style>svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }</style>
