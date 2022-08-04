<script setup lang="ts">
import { useThree } from "@/composables/useThree";
import { useGlobe } from "@/composables/useGlobe";
import { useStats } from "@/composables/useStats";
import { useGodRays } from "@/composables/useGodRays";
import { useObjectLibrary } from "@/composables/useObjectLibrary";
import { useOrbitControls } from "@/composables/useOrbitControls";
import { onBeforeUnmount, onMounted } from "vue";
import { useDatasets } from "@/composables/useDatasets";

const { initThree, destroyThree } = useThree();
const { initGlobe } = useGlobe();
const { initStats } = useStats();
const { initGodRays } = useGodRays();
const { initOrbitControls } = useOrbitControls();
const { loadDataset } = useDatasets();
const { loadGltf } = useObjectLibrary();

const dataset = await loadDataset("/geojson/countries.json");
const { scene, camera, renderer, canvas } = await initThree();
const { theGlobe, rotateGlobe, destroyGlobe } = await initGlobe(dataset);
const { renderGodRays, updateGodRaysSize } = await initGodRays();

const controls = await initOrbitControls(camera, renderer);
const { stats, destroyStats, statsMount } = await initStats();

const winterLandscape = await loadGltf(
  "/models/model1/scene.gltf",
  "winterlandscape"
);
winterLandscape.Model.rotation.x = 0;
winterLandscape.Model.position.set(-1.7, -2.3, -0.2);
winterLandscape.Model.scale.set(4, 4, 4);
scene.add(winterLandscape.Model);
scene.add(theGlobe);

let renderLoopId: number;

function renderLoop() {
  rotateGlobe(theGlobe);
  renderGodRays(renderer, camera, scene);
  stats.update();
  controls.update();
  renderLoopId = requestAnimationFrame(renderLoop);
}

function addListeners() {
  window.addEventListener("resize", onWindowResize);
}

function removeListeners() {
  window.removeEventListener("resize", onWindowResize);
}

function onWindowResize() {
  if (camera && renderer) {
    const renderTargetWidth = window.innerWidth;
    const renderTargetHeight = window.innerHeight;
    camera.aspect = renderTargetWidth / renderTargetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(renderTargetWidth, renderTargetHeight);
    updateGodRaysSize(renderTargetWidth, renderTargetHeight);
  }
}

onBeforeUnmount(async () => {
  cancelAnimationFrame(renderLoopId);
  removeListeners();
  await destroyGlobe(theGlobe);
  await destroyThree(canvas, scene, renderer);
  await destroyStats(statsMount, stats);
});

onMounted(() => {
  console.log("Mounted Scene1");
  addListeners();
  renderLoop();
});
</script>
<template><div></div></template>
