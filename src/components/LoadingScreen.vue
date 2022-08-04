<script setup lang="ts">
import { useLoadingStore } from "@/stores/loading.store";
const store = useLoadingStore();
</script>
<template>
  <div class="loading-screen" id="loading-screen">
    <div class="loading-screen__middle">
      <div class="loading-screen__content-wrapper">
        <span class="loading-screen__text">
          {{ store.statusText }}
        </span>
        <progress id="objectLoad" :value="store.progress" max="100">
          {{ store.progress }}
        </progress>
      </div>
    </div>
  </div>
</template>
<style scoped>
.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: radial-gradient(
    circle,
    rgba(255, 231, 180, 1) 0%,
    rgba(160, 211, 212, 1) 100%
  );
  &__middle {
    width: 200px;
  }
  &__content-wrapper {
    display: flex;
    flex-direction: column;
  }
  &__text {
    text-align: center;
    padding: 4px;
  }
}
progress {
  width: 200px;
  border-radius: 4px;
  height: 22px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}
progress::-webkit-progress-bar {
  background-color: rgb(66, 230, 139);
  border-radius: 4px;
}
progress::-webkit-progress-value {
  background-color: rgb(112, 228, 248);
  border-radius: 4px;
  box-shadow: 1px 1px 5px 3px rgba(207, 207, 207, 0.8);
}
progress::-moz-progress-bar {
  background-color: rgb(66, 230, 139);
  border-radius: 4px;
}
progress::-moz-progress-value {
  background-color: rgb(112, 228, 248);
  border-radius: 4px;
  box-shadow: 1px 1px 5px 3px rgba(207, 207, 207, 0.8);
}
</style>
