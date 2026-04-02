import React, { useCallback, useEffect, useRef } from "react";
import type { BikersPlayhead } from "../../../hooks/useBikersPhysics";

interface Props {
  frames: HTMLImageElement[];
  totalFrames: number;
  playhead: BikersPlayhead;
  flashOpacity: number;
}

function drawSingleFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  W: number,
  H: number,
  floatY: number,
  tiltDeg: number,
  effectiveScale: number,
) {
  if (!img?.complete || !img.naturalWidth) return;
  const fa = img.naturalWidth / img.naturalHeight;
  const ca = W / H;
  let dW: number, dH: number;
  if (ca < fa) {
    dH = H * effectiveScale;
    dW = dH * fa;
  } else {
    dW = W * effectiveScale;
    dH = dW / fa;
  }
  const dx = (W - dW) / 2;
  const dy = (H - dH) / 2;
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate((tiltDeg * Math.PI) / 180);
  ctx.translate(-W / 2, -H / 2);
  ctx.drawImage(img, dx, dy + floatY, dW, dH);
  ctx.restore();
}

function drawFrameBlend(
  ctx: CanvasRenderingContext2D,
  frames: HTMLImageElement[],
  total: number,
  floatIndex: number,
  W: number,
  H: number,
  floatY: number,
  tiltDeg: number,
  effectiveScale: number,
) {
  const frameA = Math.floor(floatIndex);
  const frameB = Math.min(frameA + 1, total - 1);
  const blend = floatIndex - frameA;
  ctx.globalAlpha = 1;
  drawSingleFrame(ctx, frames[frameA], W, H, floatY, tiltDeg, effectiveScale);
  if (blend > 0.005 && frameB !== frameA && frames[frameB]?.complete) {
    ctx.globalAlpha = blend;
    drawSingleFrame(ctx, frames[frameB], W, H, floatY, tiltDeg, effectiveScale);
  }
  ctx.globalAlpha = 1;
}

export function BikersCanvas({
  frames,
  totalFrames,
  playhead,
  flashOpacity,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const ref = useRef({ playhead, flashOpacity });
  ref.current = { playhead, flashOpacity };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { playhead: ph, flashOpacity: fo } = ref.current;
    const { currentFrame, floatY, tiltDeg, scaleVal, zoomVal, speedIntensity } = ph;

    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, W, H);

    if (!frames.length) return;

    drawFrameBlend(
      ctx,
      frames,
      totalFrames,
      currentFrame,
      W,
      H,
      floatY,
      tiltDeg,
      scaleVal * zoomVal,
    );

    if (speedIntensity > 0.08) {
      const g = ctx.createRadialGradient(
        W / 2,
        H / 2,
        H * 0.28,
        W / 2,
        H / 2,
        H * 0.82,
      );
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, `rgba(0,0,0,${speedIntensity * 0.5})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    if (fo > 0.01) {
      ctx.fillStyle = `rgba(252,248,242,${fo * 0.88})`;
      ctx.fillRect(0, 0, W, H);
    }
  }, [frames, totalFrames]);

  useEffect(() => {
    const loop = () => {
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      style={{ willChange: "transform" }}
      aria-hidden
    />
  );
}
