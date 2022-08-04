import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import type { PerspectiveCamera, WebGLRenderer } from "three";

export function useOrbitControls(): {
  initOrbitControls(
    camera: PerspectiveCamera,
    renderer: WebGLRenderer
  ): Promise<OrbitControls>;
} {
  let controls: OrbitControls;
  async function initOrbitControls(
    camera: PerspectiveCamera,
    renderer: WebGLRenderer
  ) {
    return new Promise<OrbitControls>((resolve) => {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.9;
      controls.minDistance = 0.25;
      controls.maxDistance = 0.5;
      resolve(controls);
    });
  }
  return {
    initOrbitControls,
  };
}
