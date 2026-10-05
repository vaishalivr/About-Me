import test from 'node:test';
import assert from 'node:assert/strict';
import { scene } from '../src/scene.js';
import { journeyGeometry, openingEase } from '../src/journey.js';

test('desktop opening and remaining scroll have exact alignment', () => {
  const g = journeyGeometry(scene, 1440, 900);
  assert.equal(g.compositionWidth, 7200);
  assert.equal(g.openingEnd, 1068);
  assert.equal(g.scrollDistance, 7038);
  assert.equal(g.openingEnd + g.scrollDistance / scene.scrollDistanceMultiplier, g.distance);
  assert.equal(g.compositionWidth - g.distance, 1440);
});

test('endpoint remains at its viewport anchor on phone, tablet and desktop', () => {
  for (const [w,h] of [[320,568],[390,844],[768,1024],[1440,900],[1920,1080],[2560,1440]]) {
    const g = journeyGeometry(scene,w,h);
    assert(g.openingEnd >= 0 && g.openingEnd < g.distance);
    assert(Math.abs(scene.opening.endpointX*g.compositionWidth/scene.width-g.openingEnd-w*scene.opening.viewportAnchor)<1e-8);
    assert(Math.abs(g.openingEnd+g.scrollDistance/scene.scrollDistanceMultiplier-g.distance)<1e-8);
  }
});

test('opening easing starts and stops gently without overshooting', () => {
  assert.equal(openingEase(0),0);
  assert.equal(openingEase(1),1);
  assert(openingEase(.001)<.00001);
  assert(1-openingEase(.999)<.00001);
  let last=0;
  for(let i=0;i<=100;i++){const next=openingEase(i/100);assert(next>=last && next<=1);last=next;}
});
