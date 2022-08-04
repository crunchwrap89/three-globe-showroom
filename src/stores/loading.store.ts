import { defineStore } from "pinia";

export const useLoadingStore = defineStore("useLoadingStore", {
  state: () => ({
    _progress: 0,
    _statusText: "Warming up",
  }),
  getters: {
    progress(): number {
      return this._progress;
    },
    statusText(): string {
      return this._statusText;
    },
  },
  actions: {
    setProgress(progress: number) {
      this._progress = progress;
    },
    setStatusText(statusText: string) {
      this._statusText = statusText;
    },
  },
});
