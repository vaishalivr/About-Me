<script>
  import { onMount } from 'svelte';
  import LineArtwork from './LineArtwork.svelte';
  import SceneItems from './SceneItems.svelte';
  import { scene } from '../scene.js';
  let section;
  let viewportWidth = 1;
  let viewportHeight = 1;
  let compositionWidth = 6000;
  let distance = 0;
  let travel = 0;
  $: scrollDistance = distance * scene.scrollDistanceMultiplier;
  let reducedMotion = false;
  let manualStill = null;
  $: still = manualStill ?? reducedMotion;
  $: progress = distance ? travel / distance : 0;
  $: items = scene.showPlaceholders ? scene.items : [];
  onMount(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!section) return;
      travel = Math.max(0, Math.min(distance, -section.getBoundingClientRect().top / scene.scrollDistanceMultiplier));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      viewportWidth = document.documentElement.clientWidth;
      viewportHeight = window.innerHeight;
      // Scale for legibility, then ensure at least four complete scroll lengths.
      compositionWidth = Math.max(scene.width * Math.max(.55, Math.min(1, viewportHeight / scene.height)), viewportWidth * scene.minimumScreens);
      distance = compositionWidth - viewportWidth;
      schedule();
    };
    const motion = () => { reducedMotion = preference.matches; measure(); };
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    preference.addEventListener('change', motion);
    motion();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      preference.removeEventListener('change', motion);
    };
  });
</script>
<section bind:this={section} class:still style:height={still ? 'auto' : `${scrollDistance + viewportHeight}px`} aria-label="Follow a continuous thread through a horizontal landscape">
  <div class="viewport">
    <header><button onclick={() => manualStill = !still} aria-pressed={still}>{still ? 'Scroll experience' : 'Still view'} <span aria-hidden="true">↗</span></button></header>
    <div class="opening-note" style:opacity={still ? 1 : Math.max(0, 1 - travel / (viewportWidth * .35))}><h1>It always starts<br/>with a scribble.</h1></div>
    <div class="composition" style:width={still ? '100%' : `${compositionWidth}px`} style:transform={still ? 'none' : `translate3d(${-travel}px,0,0)`}>
      <LineArtwork width={scene.width} height={scene.height} />
      {#if !still}<SceneItems {items} {scene} scaleX={compositionWidth / scene.width} {viewportWidth} {travel} reducedMotion={still} />{/if}
    </div>
    {#if still}<div class="reading"><p class="tiny">THE JOURNEY · STILL VIEW</p>{#each items as item (item.id)}<article><p class="tiny">{item.eyebrow}</p><h2>{item.title}</h2><p>{item.body}</p></article>{/each}</div>{/if}
    <footer><div class="scroll-cue"><span aria-hidden="true">↓</span><span>{still ? 'TAKE YOUR TIME' : progress > .99 ? 'YOU’VE FOLLOWED THE THREAD' : 'SCROLL TO FOLLOW THE THREAD'}</span></div><div class="progress" aria-hidden="true"><span class="number">{String(Math.min(4, Math.floor(progress * 4)) + 1).padStart(2, '0')}</span><span class="rail"><span style:width={`${progress * 100}%`}></span></span><span class="total">05</span></div></footer>
  </div>
</section>
<style>
  section { position: relative; }
  .viewport { height: 100svh; position: sticky; top: 0; overflow: hidden; background: #fff; }
  header, footer { position: absolute; z-index: 2; left: 3rem; right: 3rem; display: flex; align-items: center; justify-content: space-between; }
  header { top: 2.4rem; justify-content: flex-end; }
  .tiny, footer { font-size: .6rem; letter-spacing: .14em; }
  button { border: 0; background: none; color: #555; font: inherit; font-size: .7rem; cursor: pointer; padding: .5em; }button span { margin-left: 1em; }button:focus-visible { outline: 2px solid #555; outline-offset: .3rem; }
  .opening-note { position: absolute; left: 11.5%; top: 21%; z-index: 1; pointer-events: none; }.tiny { color: #8b8b8b; }h1 { font-family: Georgia, serif; font-size: clamp(2rem, 3.5vw, 3.6rem); font-weight: 400; letter-spacing: -.045em; line-height: 1.08; margin: 1rem 0 0; }
  .composition { position: absolute; top: 0; height: 100%; will-change: transform; }
  footer { bottom: 2.3rem; color: #666; }.scroll-cue { display: flex; align-items: center; gap: .85rem; }.scroll-cue > span:first-child { font-size: 1.3rem; color: #222; }.progress { display: flex; gap: .8rem; align-items: center; }.number { color: #222; }.total { color: #aaa; }.rail { display: block; width: 6rem; height: 1px; background: #ddd; }.rail > span { display: block; height: 100%; background: #222; }
  .still .viewport { position: relative; min-height: 100svh; height: auto; padding: 8rem 2rem 7rem; }.still .composition { position: relative; height: 28vh; min-height: 10rem; will-change: auto; }.still .opening-note { position: relative; left: auto; top: auto; margin-bottom: 2rem; }.reading { max-width: 42rem; margin: 3rem auto; }.reading article { padding: 2rem 0; border-bottom: 1px solid #eee; }.reading h2 { font: 2rem Georgia, serif; white-space: pre-line; }.reading article > p:last-child { font-size: .9rem; color: #666; line-height: 1.6; }
  @media (max-width: 600px) { header, footer { left: 1.5rem; right: 1.5rem; }header { top: 1.5rem; }.opening-note { left: 1.5rem; top: 23%; }footer { bottom: 1.5rem; }.scroll-cue { font-size: .5rem; gap: .5rem; }.rail { width: 3rem; }.progress { gap: .5rem; } }
</style>
