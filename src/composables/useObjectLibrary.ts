import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AnimationMixer } from "three";
import { skeletonClone } from "@/utils/skeletonUtils";
import { useLoadingStore } from "@/stores/loading.store";
import type { Object3D } from "three";

const gltfLoader = new GLTFLoader();

export function useObjectLibrary(): {
  loadGltf(source: string, modelName: string): Promise<GLTFObject>;
  clone3DObject(model: GLTFObject): Object3D;
} {
  async function loadGltf(
    source: string,
    modelName: string
  ): Promise<GLTFObject> {
    const store = useLoadingStore();
    return new Promise((resolve) => {
      gltfLoader.load(
        source,
        (gltf) => {
          const gltfObject = { Model: gltf.scene, Animations: gltf.animations };
          gltfObject.Model.scale.set(1, 1, 1);
          gltfObject.Model.name = modelName;
          resolve(gltfObject);
        },
        (xhr) => {
          store.setProgress(Math.round((xhr.loaded / xhr.total) * 100) - 5);
          store.setStatusText("Loading " + modelName + "...");
        },
        (error) => {
          console.log(error);
          resolve({ Model: null, Animations: [] });
        }
      );
    });
  }

  const clone3DObject = (gltf: GLTFObject) => {
    return skeletonClone(gltf.Model);
  };

  const playCloneAnimation = (gltf: GLTFObject, variant: number) => {
    const mixers = [];
    if (gltf.Animations.length > 0) {
      const mixer = new AnimationMixer(gltf.Model);
      mixer.clipAction(gltf.Animations[variant]).play();
      mixers.push(mixer);
    }
  };

  return {
    loadGltf,
    clone3DObject,
  };
}
