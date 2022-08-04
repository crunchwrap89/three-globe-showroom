import Stats from "three/examples/jsm/libs/stats.module";

type StatsEngine = {
  stats: Stats;
  destroyStats(statsMount: HTMLElement, stats: Stats): Promise<string>;
  statsMount: HTMLElement;
};

export function useStats(): {
  initStats(): Promise<StatsEngine>;
} {
  async function initStats() {
    return new Promise<StatsEngine>((resolve) => {
      const stats = Stats();
      const statsMount = document.getElementById("stats-mount")!;
      statsMount!.appendChild(stats.dom);
      resolve({ stats, destroyStats, statsMount });
    });
  }
  async function destroyStats(statsMount: HTMLElement, stats: Stats) {
    return new Promise<string>((resolve) => {
      try {
        statsMount.removeChild(statsMount.firstChild!);
        stats.end();
      } catch (e) {
        console.log(e);
      }
      resolve("removed stats");
    });
  }
  return {
    initStats,
  };
}
