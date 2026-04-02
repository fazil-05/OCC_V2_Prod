import { useCallback, useEffect, useState } from "react";

export interface FrameSequenceResult {
  frames: HTMLImageElement[];
  loaded: boolean;
  progress: number;
}

export function useFrameSequence(
  basePath: string,
  totalFrames: number,
): FrameSequenceResult {
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const loadFrames = useCallback(async () => {
    const imgs: HTMLImageElement[] = new Array(totalFrames);
    let count = 0;
    const BATCH = 20;

    async function loadBatch(start: number) {
      const end = Math.min(start + BATCH, totalFrames);
      await Promise.all(
        Array.from({ length: end - start }, (_, i) => {
          return new Promise<void>((res) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            const idx = String(start + i + 1).padStart(4, "0");
            img.src = `${basePath}${idx}.jpg`;
            img.onload = () => {
              imgs[start + i] = img;
              count++;
              setProgress(count / totalFrames);
              res();
            };
            img.onerror = () => {
              count++;
              setProgress(count / totalFrames);
              res();
            };
          });
        }),
      );
    }

    for (let i = 0; i < totalFrames; i += BATCH) {
      await loadBatch(i);
    }
    setFrames(imgs);
    setLoaded(true);
  }, [basePath, totalFrames]);

  useEffect(() => {
    loadFrames();
  }, [loadFrames]);

  return { frames, loaded, progress };
}
