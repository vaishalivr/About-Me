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
 C 345 455 470 330 590 400 C 685 455 655 510 770 490
 C 925 460 1040 520 1190 490 C 1360 455 1445 290 1610 330
 C 1800 380 1760 620 1980 590 C 2200 560 2150 250 2390 285
 C 2620 320 2570 555 2720 550 C 2900 545 2930 320 2820 330
 C 2685 345 2790 650 2990 535 C 3190 420 3270 450 3440 485
 C 3650 530 3620 180 3840 205 C 4060 230 3950 465 4150 430
 C 4350 395 4330 670 4530 635 C 4750 595 4750 340 4910 375
 C 5100 410 5040 550 5250 510 C 5450 475 5550 490 5700 490
 C 5840 490 5900 490 5970 490`;
