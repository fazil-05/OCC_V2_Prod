import { useState, useEffect, useCallback } from "react";

export interface FootballFramesResult {
  frames: HTMLImageElement[];
  loaded: boolean;
  progress: number;
}

export function useFootballFrames(
  basePath: string,
  totalFrames: number,
): FootballFramesResult {
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const load = useCallback(async () => {
    const imgs: HTMLImageElement[] = new Array(totalFrames);
    let count = 0;
    const BATCH = 30;

    const loadBatch = async (start: number) => {
      const end = Math.min(start + BATCH, totalFrames);
      await Promise.all(
        Array.from({ length: end - start }, (_, i) =>
          new Promise<void>((res) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = `${basePath}${String(start + i + 1).padStart(4, "0")}.jpg`;
            img.onload = () => { imgs[start + i] = img; count++; setProgress(count / totalFrames); res(); };
            img.onerror = () => { count++; setProgress(count / totalFrames); res(); };
          }),
        ),
      );
    };

    for (let i = 0; i < totalFrames; i += BATCH) await loadBatch(i);
    setFrames(imgs);
    setLoaded(true);
  }, [basePath, totalFrames]);

  useEffect(() => { load(); }, [load]);
  return { frames, loaded, progress };
}
