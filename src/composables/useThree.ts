import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Color,
  AmbientLight,
  ReinhardToneMapping,
  FogExp2,
} from "three";
import { disposeObject } from "@/utils/cleanUpUtils";

type ThreeEngine = {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  canvas: HTMLElement;
};

export function useThree(): {
  initThree(): Promise<ThreeEngine>;
  destroyThree(
    canvas: HTMLElement,
    scene: Scene,
    renderer: WebGLRenderer
  ): Promise<string>;
} {
  async function initThree() {
    return new Promise<ThreeEngine>((resolve) => {
      const canvas = document.getElementById("scene-mount")!;

      const scene = new Scene();
      scene.background = new Color("white");
      scene.fog = new FogExp2(0xefd1b5, 0.3025);
      const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0.1, 0.02, 0.38);
      camera.lookAt(0, 0, 0);

      scene.add(new AmbientLight(0x404040));

      const renderer = new WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = ReinhardToneMapping;
      canvas!.appendChild(renderer.domElement);

      resolve({ scene, camera, renderer, canvas });
    });
  }

  async function destroyThree(
    canvas: HTMLElement,
    scene: Scene,
    renderer: WebGLRenderer
  ) {
    return new Promise<string>((resolve) => {
      disposeObject(scene);
      renderer.dispose();
      canvas.removeChild(canvas.firstChild!);
      resolve("Destroyed");
    });
  }

  return {
    initThree,
    destroyThree,
  };
}
