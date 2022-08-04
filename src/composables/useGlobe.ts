import ThreeGlobe from "three-globe";

import { rndmPointsData } from "@/utils/randomize";
import { rndmRingsData } from "@/utils/randomize";
import { rndmArcsData } from "@/utils/randomize";

import { disposeObject } from "@/utils/cleanUpUtils";

type TheGlobeEngine = {
  theGlobe: ThreeGlobe;
  rotateGlobe(theGlobe: ThreeGlobe): void;
  destroyGlobe(theGlobe: ThreeGlobe): Promise<string>;
};

export function useGlobe(): {
  initGlobe(dataset?: any): Promise<TheGlobeEngine>;
} {
  async function initGlobe(dataset?: any) {
    return new Promise<TheGlobeEngine>((resolve) => {
      const pointsData = rndmPointsData(25, "red", "blue", "green", "orange");
      const ringsData = rndmRingsData(25);
      const arcsData = rndmArcsData(25);
      const colorInterpolator = (t: any) => `rgba(0,255,50,${1 - t})`;

      const theGlobe = new ThreeGlobe()
        .globeImageUrl(
          "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          // "//unpkg.com/three-globe/example/img/earth-dark.jpg"
          // "//unpkg.com/three-globe/example/img/earth-day.jpg"
          // "//unpkg.com/three-globe/example/img/earth-night.jpg"
          // "//unpkg.com/three-globe/example/img/earth-topology.png"
          // "//unpkg.com/three-globe/example/img/earth-water.png"
          // "//unpkg.com/three-globe/example/img/night-sky.png"
        )
        .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
        .pointsData(pointsData)
        .pointAltitude("size")
        .pointColor("color")
        .hexPolygonsData(dataset.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.3)
        .hexPolygonColor(
          () =>
            `#${Math.round(Math.random() * Math.pow(2, 24))
              .toString(16)
              .padStart(6, "0")}`
        )
        .ringsData(ringsData)
        .ringColor(() => colorInterpolator)
        .ringPropagationSpeed("propagationSpeed")
        .ringRepeatPeriod("repeatPeriod")
        .ringMaxRadius(5)
        .arcsData(arcsData)
        .arcColor("color")
        .arcDashLength(() => Math.random())
        .arcDashGap(() => Math.random())
        .arcDashAnimateTime(() => Math.random() * 4000 + 500);

      theGlobe.scale.set(0.001, 0.001, 0.001);
      theGlobe.position.set(0, 0.05, 0);

      resolve({ theGlobe, rotateGlobe, destroyGlobe });
    });
  }

  function rotateGlobe(theGlobe: ThreeGlobe) {
    theGlobe!.rotation.y += 0.001;
  }

  async function destroyGlobe(theGlobe: ThreeGlobe) {
    return new Promise<string>((resolve) => {
      disposeObject(theGlobe);
      theGlobe.removeFromParent();
      resolve("Destroyed");
    });
  }

  return {
    initGlobe,
  };
}
