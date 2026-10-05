<script>
  export let items = [];
  export let scene;
  export let scaleX = 1;
  export let viewportWidth = 1;
  export let travel = 0;
  export let reducedMotion = false;
  const clamp = (n) => Math.max(0, Math.min(1, n));
  function visibility(item) {
    if (reducedMotion) return 1;
    const screenPosition = (item.x * scaleX - travel) / viewportWidth;
    return clamp((item.reveal.start - screenPosition) / (item.reveal.start - item.reveal.end));
  }
</script>
{#each items as item (item.id)}
  {@const amount = visibility(item)}
  <article style:left={`${item.x / scene.width * 100}%`} style:top={`${item.y / scene.height * 100}%`} style:opacity={amount} style:transform={`translateY(${(1 - amount) * item.reveal.offsetRem}rem)`}>
    <p class="eyebrow">{item.eyebrow}</p>
    <h2>{item.title}</h2>
    <p class="body">{item.body}</p>
  </article>
{/each}
<style>
  article { position: absolute; width: min(23rem, 76vw); }
  .eyebrow { font-size: .625rem; letter-spacing: .17em; margin: 0 0 1.1rem; color: #757575; }
  h2 { white-space: pre-line; font-family: Georgia, serif; font-weight: 400; font-size: clamp(1.8rem, 3vw, 3rem); line-height: 1.1; letter-spacing: -.045em; margin: 0 0 1rem; }
  .body { font-size: .8rem; line-height: 1.6; color: #777; max-width: 19rem; margin: 0; }
</style>
