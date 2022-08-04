<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <nav class="navbar">
    <router-link to="/">One</router-link> |
    <router-link to="/two">Two</router-link>
  </nav>
  <RouterView :key="$route.fullPath" />
</template>

<style>
@import "@/assets/base.css";

.navbar {
  z-index: 100;
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
