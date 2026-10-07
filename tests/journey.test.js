import test from 'node:test';
import assert from 'node:assert/strict';
import { scene } from '../src/scene.js';
import { journeyGeometry, lineRevealAt } from '../src/journey.js';

test('custom reveal stops control length independently of scroll position', () => {
  const stops = [{ scroll: 0, visible: 0 }, { scroll: 0.5, visible: 0.8 }, { scroll: 1, visible: 1 }];
  assert.equal(lineRevealAt(0, stops), 0);
  assert.equal(lineRevealAt(0.25, stops), 0.4);
  assert.equal(lineRevealAt(0.5, stops), 0.8);
  assert.equal(lineRevealAt(0.75, stops), 0.9);
  assert.equal(lineRevealAt(1, stops), 1);
});

test('manual scrolling covers the full journey from the initial scribble', () => {
  for (const [w, h] of [[320, 568], [390, 844], [768, 1024], [1440, 900], [1920, 1080], [2560, 1440]]) {
    const g = journeyGeometry(scene, w, h);
    assert(g.distance > 0);
    assert.equal(g.scrollDistance / scene.scrollDistanceMultiplier, g.distance);
    assert.equal(g.compositionWidth - g.distance, w);
  }
});
