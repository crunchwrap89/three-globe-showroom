<template>
  <div id="stats-mount"></div>
  <div id="scene-mount"></div>
  <Suspense>
    <template #default>
      <SceneOne />
    </template>
    <template #fallback>
      <LoadingScreen />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import LoadingScreen from "@/components/LoadingScreen.vue";
import SceneOne from "../components/SceneOne.vue";
</script>

<style>
#scene-mount,
#loading-screen {
  position: absolute;
  height: auto;
  width: 100%;
  top: 0;
  bottom: 0;
  border: none;
  min-height: 100%;
  z-index: 10;
}
</style>
