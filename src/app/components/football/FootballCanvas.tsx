import React, { useCallback, useEffect, useRef } from "react";
import type { FootballPlayhead } from "../../../hooks/useFootballPhysics";

interface Props {
  frames:       HTMLImageElement[];
  totalFrames:  number;
  playhead:     FootballPlayhead;
  flashOpacity: number;
}

// ─── Cover-fit a single frame with antigravity transform ─────────────────────
function drawSingleFrame(
  ctx:            CanvasRenderingContext2D,
  img:            HTMLImageElement,
  W:              number,
  H:              number,
  floatY:         number,
  tiltDeg:        number,
  effectiveScale: number,
) {
  if (!img?.complete || !img.naturalWidth) return;

  const fa = img.naturalWidth / img.naturalHeight;
  const ca = W / H;

  let dW: number, dH: number;
  if (ca < fa) { dH = H * effectiveScale; dW = dH * fa; }
  else         { dW = W * effectiveScale; dH = dW / fa; }

  const dx = (W - dW) / 2;
  const dy = (H - dH) / 2;

  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate((tiltDeg * Math.PI) / 180);
  ctx.translate(-W / 2, -H / 2);
  ctx.drawImage(img, dx, dy + floatY, dW, dH);
  ctx.restore();
}

// ─── Cross-fade between adjacent frames — eliminates discrete frame jumps ────
function drawFrameBlend(
  ctx:            CanvasRenderingContext2D,
  frames:         HTMLImageElement[],
  total:          number,
  floatIndex:     number,
  W:              number,
  H:              number,
  floatY:         number,
  tiltDeg:        number,
  effectiveScale: number,
) {
  const frameA = Math.floor(floatIndex);
  const frameB = Math.min(frameA + 1, total - 1);
  const blend  = floatIndex - frameA;

  ctx.globalAlpha = 1;
  drawSingleFrame(ctx, frames[frameA], W, H, floatY, tiltDeg, effectiveScale);

  if (blend > 0.005 && frameB !== frameA && frames[frameB]?.complete) {
    ctx.globalAlpha = blend;
    drawSingleFrame(ctx, frames[frameB], W, H, floatY, tiltDeg, effectiveScale);
  }
  ctx.globalAlpha = 1;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function FootballCanvas({ frames, totalFrames, playhead, flashOpacity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const ref       = useRef({ playhead, flashOpacity });
  ref.current     = { playhead, flashOpacity };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W   = canvas.clientWidth;
    const H   = canvas.clientHeight;

    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { playhead: ph, flashOpacity: fo } = ref.current;
    const { currentFrame, floatY, tiltDeg, scaleVal, zoomVal, speedIntensity } = ph;

    // Background
    ctx.fillStyle = "#060606";
    ctx.fillRect(0, 0, W, H);

    if (!frames.length) return;

    // Sub-frame blended draw
    drawFrameBlend(
      ctx, frames, totalFrames, currentFrame,
      W, H, floatY, tiltDeg, scaleVal * zoomVal,
    );

    // Speed vignette
    if (speedIntensity > 0.08) {
      const g = ctx.createRadialGradient(W/2, H/2, H*0.28, W/2, H/2, H*0.82);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, `rgba(0,0,0,${speedIntensity * 0.52})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // Stadium flash
    if (fo > 0.01) {
      ctx.fillStyle = `rgba(255,255,255,${fo})`;
      ctx.fillRect(0, 0, W, H);
    }
  }, [frames, totalFrames]);

  useEffect(() => {
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
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
