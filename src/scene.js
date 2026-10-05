// All artwork and HTML items share this coordinate system.
export const scene = {
  width: 6000,
  height: 900,
  minimumScreens: 5, // start + four full viewport widths of horizontal travel
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
export const scribbleSettings = { shiftX: 80, extraDiameterRem: 3, delayMs: 30, durationMs: 3000 };
// Six explicit loops with gently staggered joins and matching tangent handles.
// Each join has incoming/outgoing handles of (-60,-50)/(+60,+50),
// avoiding a cusp or a repeated knot in the upper-right quadrant.
export const extraLoops = `
 C 650 450 700 560 545 585 C 365 615 345 340 505 325 C 570 320 540 360 600 410
 C 660 460 710 505 600 570 C 440 665 335 410 455 350 C 520 315 550 370 610 420
 C 670 470 640 600 480 570 C 340 540 400 295 555 330 C 625 345 540 365 600 415
 C 660 465 705 595 525 600 C 360 600 345 330 515 315 C 600 310 525 350 585 400
 C 645 450 725 510 575 590 C 410 660 345 380 485 340 C 560 315 535 355 595 405
 C 655 455 635 625 465 560 C 330 500 435 285 585 345 C 630 370 550 360 610 410`;
export const scribbleExit = [610, 410];
export const scribblePath = linePath.slice(linePath.indexOf(' C 340'), linePath.indexOf(' C 685 455')) + extraLoops;
export const landscapePath = linePath.slice(linePath.indexOf(' C 925'));
