export function useDatasets(): {
  loadDataset(sourceUrl: string): Promise<any>;
} {
  async function loadDataset(sourceUrl: string) {
    return new Promise<any>((resolve) =>
      fetch(sourceUrl).then((resp) => {
        resolve(resp.json());
      })
    );
  }
  return {
    loadDataset,
  };
}
