// Wait before the initial scribble starts, in milliseconds. Use 0 for no delay.
export const drawDelayMs = 900;

// Initial scribble duration in milliseconds. Lower values draw faster.
export const initialDrawDurationMs = 6000;

// Initial draw stops after the last occurrence of this exact SVG path fragment
// in linePath.js. Pick a fragment ending at a complete path command/coordinate.
// If no match is found, the initial draw reveals the entire path.
export const prefixSegment = "1337 285.859";

// Duration in milliseconds for the final reveal and its reverse transition.
// Lower values finish faster.
export const finalRevealDurationMs = 2000;

// Duration in milliseconds to erase the remaining scribble at the scroll start.
export const startRetractionDurationMs = 4000;

// Minimum horizontal scroll distance used to reveal the remaining line.
// The actual distance is the larger of this value and the available scroll width.
// Lower values reveal faster only when this minimum exceeds that width.
export const scrollDistanceForFullReveal = 4000;

// Total scene translation in SVG container CSS pixels over the scroll reveal.
// Higher values move the scene farther to the left.
export const totalHorizontalSceneTravel = 1600;
