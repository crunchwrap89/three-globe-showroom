import { Easing, Tween, update } from "@tweenjs/tween.js";
import type { Object3D, Vector3 } from "three";
import { AnimationMixer, Clock } from "three";

const clock: Clock = new Clock();
const mixers: AnimationMixer[] = [];
let frameId: number | null = null;

export function useAnimationTools(): {
  moveHorizontalTo(model: Object3D, dest: Vector3): void;
  moveVerticalTo(model: Object3D, point: any): void;
  addModelMixer(gltf: GLTFObject, variant: number): void;
} {
  //make object animate a move between A to B, will also rotate the object so that it points to B.
  function moveHorizontalTo(model: Object3D, dest: Vector3) {
    new Tween(model.position)
      .to(dest, 1)
      .easing(Easing.Quadratic.Out)
      .onUpdate(() => {
        model.position.set(
          model.position.x,
          model.position.y,
          model.position.z
        );
      })
      .onStart(function () {})
      .onComplete(function () {})
      .start();

    if (!frameId) {
      frameId = requestAnimationFrame(renderLoop);
    }

    model.rotation.y = Math.atan2(
      dest.x - model.position.x,
      dest.z - model.position.z
    );
  }

  function gravityPullTo(model: Object3D, dest: Vector3) {
    new Tween(model.position)
      .to(dest, 250)
      .easing(Easing.Quadratic.Out)
      .onUpdate(() => {
        model.position.set(
          model.position.x,
          model.position.y,
          model.position.z
        );
      })
      .onStart(function () {})
      .onComplete(function () {})
      .start();

    if (!frameId) {
      frameId = requestAnimationFrame(renderLoop);
    }
  }

  //Make object fall from the sky
  function moveVerticalTo(model: Object3D, dest: Vector3) {
    model.position.y = 500;

    new Tween(model.position)
      .to(dest, 150)
      .easing(Easing.Quadratic.Out)
      .onUpdate(() => {
        model.position.set(
          model.position.x,
          model.position.y,
          model.position.z
        );
      })
      .onStart(function () {})
      .onComplete(function () {})
      .start();

    if (!frameId) {
      frameId = requestAnimationFrame(renderLoop);
    }
  }

  function addModelMixer(gltf: GLTFObject, variant: number) {
    if (gltf.Animations.length > 0) {
      const mixer = new AnimationMixer(gltf.Model);
      mixer.clipAction(gltf.Animations[variant]).play();
      mixers.push(mixer);
    }
  }

  function renderLoop(time: number) {
    frameId = requestAnimationFrame(renderLoop);
    update(time);
    const delta = clock.getDelta();
    for (const mixer of mixers) {
      mixer.update(delta);
    }
  }

  return {
    moveHorizontalTo,
    moveVerticalTo,
    addModelMixer,
  };
}
