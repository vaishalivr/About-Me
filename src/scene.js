// All artwork and HTML items share this coordinate system.
export const scene = {
  width: 6000,
  height: 900,
  minimumScreens: 5, // start + four full viewport widths of horizontal travel
  scrollDistanceMultiplier: 1.5, // 50% more vertical travel; no easing lag
  showPlaceholders: true,
  items: [
    { id: 'possibility', x: 1850, y: 250, eyebrow: '01 / UNRAVEL', title: 'Every thought\nstarts somewhere.', body: 'A little chaos. A single thread. A way forward.', reveal: { start: 0.94, end: 0.66, offsetRem: 1.2 } },
    { id: 'perspective', x: 4100, y: 570, eyebrow: '02 / WANDER', title: 'Follow the unexpected.', body: 'There is no straight line from here to there.', reveal: { start: 0.94, end: 0.66, offsetRem: 1.2 } }
  ]
};
// One explicit continuous path. Edit these Bézier coordinates freely.
export const linePath = `M -30 490 C 90 490 180 490 260 490
 C 340 490 360 350 460 320 C 590 280 695 420 615 520
 C 550 620 340 560 365 420 C 390 280 610 245 655 380
 C 710 510 520 650 420 545 C 305 440 440 295 575 335
 C 740 375 655 630 485 585 C 325 540 375 335 540 300
 C 695 265 745 465 595 570 C 455 670 325 475 425 365
 C 520 260 735 355 650 510 C 565 670 335 590 350 440
 C 365 290 630 300 685 435 C 740 570 485 650 405 505
 C 325 360 510 265 625 355 C 780 470 575 635 460 545
 C 345 455 530 350 590 400 C 685 455 655 510 770 490
 C 925 460 1040 520 1190 490 C 1360 455 1445 290 1610 330
 C 1800 380 1760 620 1980 590 C 2200 560 2150 250 2390 285
 C 2620 320 2570 555 2720 550 C 2900 545 2930 320 2820 330
 C 2685 345 2790 650 2990 535 C 3190 420 3270 450 3440 485
 C 3650 530 3620 180 3840 205 C 4060 230 3950 465 4150 430
 C 4350 395 4330 670 4530 635 C 4750 595 4750 340 4910 375
 C 5100 410 5040 550 5250 510 C 5450 475 5550 490 5700 490
 C 5840 490 5900 490 5970 490`;

// Scribble changes are isolated from the rest of the landscape.
export const scribbleSettings = { shiftX: 120, extraDiameterRem: 3, delayMs: 30, durationMs: 3000 };
// Six complete oval passes. Their joins lie on the outer right edge,
// with vertical tangents, rather than returning to an interior pinch point.
export const extraLoops = `
 C 690 560 610 620 520 620 C 430 620 350 560 350 470 C 350 380 430 320 520 320 C 610 320 695 380 695 470
 C 695 565 615 625 520 625 C 425 625 345 565 345 470 C 345 375 425 315 520 315 C 615 315 700 375 700 470
 C 700 558 608 618 520 618 C 432 618 355 558 355 470 C 355 382 432 325 520 325 C 608 325 690 382 690 470
 C 690 568 618 630 520 630 C 422 630 340 568 340 470 C 340 372 422 310 520 310 C 618 310 705 372 705 470
 C 705 562 612 622 520 622 C 428 622 348 562 348 470 C 348 378 428 318 520 318 C 612 318 698 378 698 470
 C 698 566 616 627 520 627 C 424 627 343 566 343 470 C 343 374 424 313 520 313 C 616 313 710 374 710 470`;
export const scribbleExit = [710, 470];
// Preserve the original uneven, tangled passes. Only the final inward
// hook is removed; its replacement follows the outside into the six loops.
export const baseScribble = linePath.slice(linePath.indexOf(' C 340'), linePath.indexOf(' C 345 455'))
  + ' C 370 490 360 350 520 310 C 610 290 690 375 690 470';
// Three uneven crossing passes add a little more hand-drawn density.
// Joins stay on the outside with downward tangents to avoid the old hook.
export const tangleLoops = `
 C 690 560 480 660 395 535 C 315 420 425 290 570 330 C 705 370 670 380 670 470
 C 670 575 425 620 380 455 C 335 310 610 275 650 395 C 690 510 615 565 470 540 C 335 515 415 295 565 310 C 685 325 700 385 700 470
 C 700 575 545 640 425 570 C 300 500 390 315 535 335 C 710 355 615 635 465 555 C 335 485 420 290 580 325 C 675 345 690 390 690 470`;
export const scribblePath = baseScribble + tangleLoops + extraLoops;
// The exit bridge now joins at (1190,490), matching the next tangent.
export const landscapePath = linePath.slice(linePath.indexOf(' C 1360'));
