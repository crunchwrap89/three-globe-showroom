import {
  Scene,
  ShaderMaterial,
  Vector3,
  Vector4,
  Mesh,
  PlaneGeometry,
  UniformsUtils,
  OrthographicCamera,
  MeshDepthMaterial,
  WebGLRenderTarget,
  WebGLRenderer,
  PerspectiveCamera,
} from "three";

import {
  GodRaysFakeSunShader,
  GodRaysDepthMaskShader,
  GodRaysCombineShader,
  GodRaysGenerateShader,
} from "three/examples/jsm/shaders/GodRaysShader.js";

type GodrayFunctions = {
  renderGodRays(
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    scene: Scene
  ): void;
  updateGodRaysSize(
    renderTargetWidth: number,
    renderTargetHeight: number
  ): void;
};

export function useGodRays(): {
  initGodRays(): Promise<GodrayFunctions>;
} {
  const sunPosition = new Vector3(0, 700, -1000);
  const clipPosition = new Vector4();
  const screenSpacePosition = new Vector3();

  const postprocessing: any = { enabled: true };

  const bgColor = 0x000511;
  const sunColor = 0xffee00;

  const godrayRenderTargetResolutionMultiplier = 1.0 / 4.0;

  const materialDepth = new MeshDepthMaterial();

  function updateGodRaysSize(
    renderTargetWidth: number,
    renderTargetHeight: number
  ) {
    postprocessing.rtTextureColors.setSize(
      renderTargetWidth,
      renderTargetHeight
    );
    postprocessing.rtTextureDepth.setSize(
      renderTargetWidth,
      renderTargetHeight
    );
    postprocessing.rtTextureDepthMask.setSize(
      renderTargetWidth,
      renderTargetHeight
    );

    const adjustedWidth =
      renderTargetWidth * godrayRenderTargetResolutionMultiplier;
    const adjustedHeight =
      renderTargetHeight * godrayRenderTargetResolutionMultiplier;
    postprocessing.rtTextureGodRays1.setSize(adjustedWidth, adjustedHeight);
    postprocessing.rtTextureGodRays2.setSize(adjustedWidth, adjustedHeight);
  }
  async function initGodRays() {
    return new Promise<GodrayFunctions>((resolve) => {
      const renderTargetWidth = window.innerWidth;
      const renderTargetHeight = window.innerHeight;
      postprocessing.scene = new Scene();

      postprocessing.camera = new OrthographicCamera(
        -0.5,
        0.5,
        0.5,
        -0.5,
        -10000,
        10000
      );
      postprocessing.camera.position.z = 100;

      postprocessing.scene.add(postprocessing.camera);

      postprocessing.rtTextureColors = new WebGLRenderTarget(
        renderTargetWidth,
        renderTargetHeight
      );
      postprocessing.rtTextureDepth = new WebGLRenderTarget(
        renderTargetWidth,
        renderTargetHeight
      );
      postprocessing.rtTextureDepthMask = new WebGLRenderTarget(
        renderTargetWidth,
        renderTargetHeight
      );

      const adjustedWidth =
        renderTargetWidth * godrayRenderTargetResolutionMultiplier;
      const adjustedHeight =
        renderTargetHeight * godrayRenderTargetResolutionMultiplier;
      postprocessing.rtTextureGodRays1 = new WebGLRenderTarget(
        adjustedWidth,
        adjustedHeight
      );
      postprocessing.rtTextureGodRays2 = new WebGLRenderTarget(
        adjustedWidth,
        adjustedHeight
      );

      const godraysMaskShader = GodRaysDepthMaskShader;
      postprocessing.godrayMaskUniforms = UniformsUtils.clone(
        godraysMaskShader.uniforms
      );
      postprocessing.materialGodraysDepthMask = new ShaderMaterial({
        uniforms: postprocessing.godrayMaskUniforms,
        vertexShader: godraysMaskShader.vertexShader,
        fragmentShader: godraysMaskShader.fragmentShader,
      });

      const godraysGenShader = GodRaysGenerateShader;
      postprocessing.godrayGenUniforms = UniformsUtils.clone(
        godraysGenShader.uniforms
      );
      postprocessing.materialGodraysGenerate = new ShaderMaterial({
        uniforms: postprocessing.godrayGenUniforms,
        vertexShader: godraysGenShader.vertexShader,
        fragmentShader: godraysGenShader.fragmentShader,
      });

      const godraysCombineShader = GodRaysCombineShader;
      postprocessing.godrayCombineUniforms = UniformsUtils.clone(
        godraysCombineShader.uniforms
      );
      postprocessing.materialGodraysCombine = new ShaderMaterial({
        uniforms: postprocessing.godrayCombineUniforms,
        vertexShader: godraysCombineShader.vertexShader,
        fragmentShader: godraysCombineShader.fragmentShader,
      });

      const godraysFakeSunShader = GodRaysFakeSunShader;
      postprocessing.godraysFakeSunUniforms = UniformsUtils.clone(
        godraysFakeSunShader.uniforms
      );
      postprocessing.materialGodraysFakeSun = new ShaderMaterial({
        uniforms: postprocessing.godraysFakeSunUniforms,
        vertexShader: godraysFakeSunShader.vertexShader,
        fragmentShader: godraysFakeSunShader.fragmentShader,
      });

      postprocessing.godraysFakeSunUniforms.bgColor.value.setHex(bgColor);
      postprocessing.godraysFakeSunUniforms.sunColor.value.setHex(sunColor);

      postprocessing.godrayCombineUniforms.fGodRayIntensity.value = 0.55;

      postprocessing.quad = new Mesh(
        new PlaneGeometry(1.0, 1.0),
        postprocessing.materialGodraysGenerate
      );
      postprocessing.quad.position.z = -9900;
      postprocessing.scene.add(postprocessing.quad);

      resolve({ renderGodRays, updateGodRaysSize });
    });
  }

  function getStepSize(filterLen: any, tapsPerPass: any, pass: any) {
    return filterLen * Math.pow(tapsPerPass, -pass);
  }

  function filterGodRays(
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    inputTex: any,
    renderTarget: any,
    stepSize: any
  ) {
    postprocessing.scene.overrideMaterial =
      postprocessing.materialGodraysGenerate;

    postprocessing.godrayGenUniforms["fStepSize"].value = stepSize;
    postprocessing.godrayGenUniforms["tInput"].value = inputTex;

    renderer.setRenderTarget(renderTarget);
    renderer.render(postprocessing.scene, postprocessing.camera);
    postprocessing.scene.overrideMaterial = null;
  }

  function renderGodRays(
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    scene: Scene
  ) {
    if (postprocessing.enabled) {
      clipPosition.x = sunPosition.x;
      clipPosition.y = sunPosition.y;
      clipPosition.z = sunPosition.z;
      clipPosition.w = 1;

      clipPosition
        .applyMatrix4(camera.matrixWorldInverse)
        .applyMatrix4(camera.projectionMatrix);

      clipPosition.x /= clipPosition.w;
      clipPosition.y /= clipPosition.w;

      screenSpacePosition.x = (clipPosition.x + 1) / 2;
      screenSpacePosition.y = (clipPosition.y + 1) / 2;
      screenSpacePosition.z = clipPosition.z;

      postprocessing.godrayGenUniforms["vSunPositionScreenSpace"].value.copy(
        screenSpacePosition
      );
      postprocessing.godraysFakeSunUniforms[
        "vSunPositionScreenSpace"
      ].value.copy(screenSpacePosition);

      renderer.setRenderTarget(postprocessing.rtTextureColors);
      renderer.clear(true, true, false);

      const sunsqH = 0.74 * window.innerHeight;
      const sunsqW = 0.74 * window.innerHeight;

      screenSpacePosition.x *= window.innerWidth;
      screenSpacePosition.y *= window.innerHeight;

      renderer.setScissor(
        screenSpacePosition.x - sunsqW / 2,
        screenSpacePosition.y - sunsqH / 2,
        sunsqW,
        sunsqH
      );
      renderer.setScissorTest(true);

      postprocessing.godraysFakeSunUniforms["fAspect"].value =
        window.innerWidth / window.innerHeight;

      postprocessing.scene.overrideMaterial =
        postprocessing.materialGodraysFakeSun;
      renderer.setRenderTarget(postprocessing.rtTextureColors);
      renderer.render(postprocessing.scene, postprocessing.camera);

      renderer.setScissorTest(false);

      scene.overrideMaterial = null;
      renderer.setRenderTarget(postprocessing.rtTextureColors);
      renderer.render(scene, camera);

      scene.overrideMaterial = materialDepth;
      renderer.setRenderTarget(postprocessing.rtTextureDepth);
      renderer.clear();
      renderer.render(scene, camera);

      postprocessing.godrayMaskUniforms["tInput"].value =
        postprocessing.rtTextureDepth.texture;

      postprocessing.scene.overrideMaterial =
        postprocessing.materialGodraysDepthMask;
      renderer.setRenderTarget(postprocessing.rtTextureDepthMask);
      renderer.render(postprocessing.scene, postprocessing.camera);

      const filterLen = 0.3;
      const TAPS_PER_PASS = 3.0;

      filterGodRays(
        renderer,
        camera,
        postprocessing.rtTextureDepthMask.texture,
        postprocessing.rtTextureGodRays2,
        getStepSize(filterLen, TAPS_PER_PASS, 1.0)
      );

      filterGodRays(
        renderer,
        camera,
        postprocessing.rtTextureGodRays2.texture,
        postprocessing.rtTextureGodRays1,
        getStepSize(filterLen, TAPS_PER_PASS, 2.0)
      );

      filterGodRays(
        renderer,
        camera,
        postprocessing.rtTextureGodRays1.texture,
        postprocessing.rtTextureGodRays2,
        getStepSize(filterLen, TAPS_PER_PASS, 3.0)
      );

      postprocessing.godrayCombineUniforms["tColors"].value =
        postprocessing.rtTextureColors.texture;
      postprocessing.godrayCombineUniforms["tGodRays"].value =
        postprocessing.rtTextureGodRays2.texture;

      postprocessing.scene.overrideMaterial =
        postprocessing.materialGodraysCombine;

      renderer.setRenderTarget(null);
      renderer.render(postprocessing.scene, postprocessing.camera);
      postprocessing.scene.overrideMaterial = null;
    } else {
      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(scene, camera);
    }
  }
  return {
    initGodRays,
  };
}
