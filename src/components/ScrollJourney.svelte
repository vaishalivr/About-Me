<script>
  import { onMount, tick } from 'svelte';
  import LineArtwork from './LineArtwork.svelte';
  import SceneItems from './SceneItems.svelte';
  import { scene } from '../scene.js';
  import { clamp, journeyGeometry, openingEase } from '../journey.js';
  let section;
  let viewport;
  let viewportWidth = 1;
  let viewportHeight = 1;
  let compositionWidth = 6000;
  let distance = 0;
  let openingEnd = 0;
  let scrollDistance = 0;
  let travel = 0;
  let still = false;
  let phase = 'waiting';
  let readyAt = 0;
  let autoplayStartedAt = 0;
  let notifyArtworkReady = () => {};
  let toggleView = () => {};
  $: progress = distance ? travel / distance : 0;
  $: items = scene.showPlaceholders ? scene.items : [];

  onMount(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let alive = true;
    let loaded = document.readyState === 'complete';
    let artworkReady = false;
    let consumedOpening = false;
    let delayTimer;
    let animationFrame = 0;
    let scrollFrame = 0;
    let openingProgress = 0;
    let scrollAnchor = window.scrollY;
    let locked = false;
    let previousOverflow = '';
    const sectionTop = () => window.scrollY + section.getBoundingClientRect().top;
    const guarded = () => !still && (phase === 'waiting' || phase === 'opening');
    const lock = () => {
      if (locked) return;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      locked = true;
      scrollAnchor = sectionTop();
      window.scrollTo({ top: scrollAnchor, behavior: 'instant' });
    };
    const unlock = () => {
      if (!locked) return;
      document.body.style.overflow = previousOverflow;
      locked = false;
    };
    const cancelOpening = () => {
      clearTimeout(delayTimer);
      delayTimer = undefined;
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };
    const updateScroll = () => {
      scrollFrame = 0;
      if (!alive || still) return;
      if (guarded()) {
        // Also discard scrollbar/programmatic input rather than bank it.
        if (Math.abs(window.scrollY - scrollAnchor) > .5) window.scrollTo({ top: scrollAnchor, behavior: 'instant' });
        return;
      }
      travel = openingEnd + clamp((window.scrollY - scrollAnchor) / scene.scrollDistanceMultiplier, 0, distance - openingEnd);
    };
    const scheduleScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); };
    const completeOpening = () => {
      consumedOpening = true;
      openingProgress = 1;
      travel = openingEnd;
      // Restore native scrolling only after discarding all input from autoplay.
      scrollAnchor = sectionTop();
      window.scrollTo({ top: scrollAnchor, behavior: 'instant' });
      phase = 'scroll';
      unlock();
    };
    const animate = (now) => {
      if (!alive || still || phase !== 'opening') return;
      if (!autoplayStartedAt) autoplayStartedAt = now;
      openingProgress = clamp((now - autoplayStartedAt) / Math.max(1, scene.opening.durationMs));
      travel = openingEnd * openingEase(openingProgress);
      if (openingProgress === 1) completeOpening();
      else animationFrame = requestAnimationFrame(animate);
    };
    const startWhenReady = () => {
      if (!alive || still || consumedOpening || !loaded || !artworkReady || !distance || delayTimer !== undefined || phase !== 'waiting') return;
      readyAt = performance.now();
      delayTimer = setTimeout(() => {
        delayTimer = undefined;
        if (!alive || still || consumedOpening) return;
        phase = 'opening';
        animationFrame = requestAnimationFrame(animate);
      }, scene.opening.startDelayMs);
    };
    const measure = () => {
      const w = document.documentElement.clientWidth;
      const h = viewport.getBoundingClientRect().height;
      if (w === viewportWidth && h === viewportHeight && distance) return;
      const remainingFraction = clamp((travel - openingEnd) / Math.max(1, distance - openingEnd));
      viewportWidth = w;
      viewportHeight = h;
      ({ compositionWidth, distance, openingEnd, scrollDistance } = journeyGeometry(scene, w, h));
      if (phase === 'opening') travel = openingEnd * openingEase(openingProgress);
      else if (phase === 'scroll') travel = openingEnd + remainingFraction * (distance - openingEnd);
      tick().then(() => {
        if (!alive) return;
        if (!still && phase === 'scroll') {
          scrollAnchor = sectionTop();
          window.scrollTo({ top: scrollAnchor + remainingFraction * scrollDistance, behavior: 'instant' });
        }
        startWhenReady();
      });
    };
    const setView = (value) => {
      still = value;
      if (still) {
        cancelOpening();
        consumedOpening = true;
        phase = 'still';
        unlock();
      } else {
        // Returning from the accessible overview never replays the opening.
        phase = 'scroll';
        travel = openingEnd;
        tick().then(() => {
          if (!alive || still || phase !== 'scroll') return;
          measure();
          scrollAnchor = sectionTop();
          window.scrollTo({ top: scrollAnchor, behavior: 'instant' });
        });
      }
    };
    toggleView = () => setView(!still);
    const motionChange = () => setView(preference.matches);
    const onLoad = () => { loaded = true; startWhenReady(); };
    notifyArtworkReady = () => { artworkReady = true; startWhenReady(); };
    const preventInput = (event) => { if (guarded()) event.preventDefault(); };
    const preventScrollKeys = (event) => {
      const tag = event.target?.tagName;
      if (['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || event.target?.isContentEditable) return;
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) preventInput(event);
    };
    still = preference.matches;
    if (still) { consumedOpening = true; phase = 'still'; }
    else lock();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    window.addEventListener('load', onLoad);
    window.addEventListener('scroll', scheduleScroll, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('wheel', preventInput, { passive: false });
    window.addEventListener('touchmove', preventInput, { passive: false });
    window.addEventListener('keydown', preventScrollKeys);
    preference.addEventListener('change', motionChange);
    measure();
    return () => {
      alive = false;
      cancelOpening();
      cancelAnimationFrame(scrollFrame);
      observer.disconnect();
      unlock();
      window.removeEventListener('load', onLoad);
      window.removeEventListener('scroll', scheduleScroll);
      window.removeEventListener('resize', measure);
      window.removeEventListener('wheel', preventInput);
      window.removeEventListener('touchmove', preventInput);
      window.removeEventListener('keydown', preventScrollKeys);
      preference.removeEventListener('change', motionChange);
    };
  });
</script>
<section bind:this={section} data-phase={phase} data-opening-end={openingEnd} data-ready-at={readyAt} data-autoplay-started-at={autoplayStartedAt} class:still style:height={still ? 'auto' : `${scrollDistance + viewportHeight}px`} aria-label="Follow a continuous thread through a horizontal landscape">
  <div bind:this={viewport} class="viewport">
    <header><button onclick={() => toggleView()} aria-pressed={still}>{still ? 'Scroll experience' : 'Still view'} <span aria-hidden="true">↗</span></button></header>
    <div class="opening-note" style:opacity={still ? 1 : Math.max(0, 1 - travel / (viewportWidth * .35))}><h1>It always starts<br/>with a scribble.</h1></div>
    <div class="composition" style:width={still ? '100%' : `${compositionWidth}px`} style:transform={still ? 'none' : `translate3d(${-travel}px,0,0)`}>
      <LineArtwork width={scene.width} height={scene.height} onReady={() => notifyArtworkReady()} />
      {#if !still}<SceneItems {items} {scene} scaleX={compositionWidth / scene.width} {viewportWidth} {travel} reducedMotion={still} />{/if}
    </div>
    {#if still}<div class="reading"><p class="tiny">THE JOURNEY · STILL VIEW</p>{#each items as item (item.id)}<article><p class="tiny">{item.eyebrow}</p><h2>{item.title}</h2><p>{item.body}</p></article>{/each}</div>{/if}
    <footer><div class="scroll-cue"><span aria-hidden="true">↓</span><span>{still ? 'TAKE YOUR TIME' : phase !== 'scroll' ? 'FOLLOWING THE THREAD' : progress > .99 ? 'YOU’VE FOLLOWED THE THREAD' : 'SCROLL TO FOLLOW THE THREAD'}</span></div><div class="progress" aria-hidden="true"><span class="number">{String(Math.min(4, Math.floor(progress * 4)) + 1).padStart(2, '0')}</span><span class="rail"><span style:width={`${progress * 100}%`}></span></span><span class="total">05</span></div></footer>
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
