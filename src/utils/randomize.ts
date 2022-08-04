/**
 * Randomizes geoJSON for pointsData on theGlobe.
 *
 * @param N number
 * @param C1 string
 * @param C2 string
 * @param C3 string
 * @param C4 string
 */
export function rndmPointsData(
  N: number,
  C1: string,
  C2: string,
  C3: string,
  C4: string
) {
  return [...Array(N).keys()].map(() => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: Math.random() / 4,
    color: [C1, C2, C3, C4][Math.round(Math.random() * 3)],
  }));
}

/**
 * Randomizes geoJSON for ringsData on theGlobe.
 *
 * @param N number
 */
export function rndmRingsData(N: number) {
  return [...Array(N).keys()].map(() => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    maxR: Math.random() * 20 + 3,
    propagationSpeed: (Math.random() - 0.5) * 20 + 1,
    repeatPeriod: Math.random() * 2000 + 200,
  }));
}
/**
 * Randomizes geoJSON for arcsData on theGlobe.
 *
 * @param N number
 */
export function rndmArcsData(N: number) {
  return [...Array(N).keys()].map(() => ({
    startLat: (Math.random() - 0.5) * 180,
    startLng: (Math.random() - 0.5) * 360,
    endLat: (Math.random() - 0.5) * 180,
    endLng: (Math.random() - 0.5) * 360,
    color: [
      ["gold", "white", "skyblue", "green"][Math.round(Math.random() * 3)],
      ["indianred", "white", "purple", "green"][Math.round(Math.random() * 3)],
    ],
  }));
}
