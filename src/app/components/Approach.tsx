"use client";

import React, { useId, useLayoutEffect, useRef, useState } from "react";
import { MovableBlock } from "./LayoutEditor";

const TUBE_PATH = "M 0 0 C 400 0 700 300 700 800";

/** Decorative tube — fully drawn, not tied to page scroll. */
function StaticTube() {
  const pathRef = useRef<SVGPathElement>(null);
  const filterId = useId().replace(/:/g, "");
  const [pathLen, setPathLen] = useState(2200);

  useLayoutEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const L = el.getTotalLength();
    if (L > 0) setPathLen(L);
  }, []);

  return (
    <svg
      viewBox="0 0 1000 1000"
      className="absolute -left-[8%] -top-[18%] h-[125%] w-[85%] min-w-[280px] text-indigo-600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        ref={pathRef}
        d={TUBE_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={72}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLen}
        strokeDashoffset={0}
        style={{ filter: `url(#${filterId})` }}
      />
    </svg>
  );
}

export function Approach() {
  return (
    <section className="relative isolate w-full max-w-[100vw] overflow-visible bg-[#F6F7FA] px-4 py-24 sm:px-6 md:px-12 md:py-32">
      <MovableBlock
        id="approach-purple-tube"
        className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      >
        <StaticTube />
      </MovableBlock>

      <div className="relative z-20 mx-auto mt-8 grid w-full max-w-[90rem] grid-cols-1 gap-12 md:mt-12 md:grid-cols-2 md:gap-24 lg:gap-32">
        <MovableBlock id="approach-heading">
          <div>
            <h2 className="whitespace-pre-line text-[2.75rem] font-medium leading-[0.98] tracking-tighter text-slate-900 sm:text-[4rem] md:text-[5rem] lg:text-[6rem] xl:text-[6.5rem]">
              {"Clubs beyond\n the lecture hall"}
            </h2>
          </div>
        </MovableBlock>

        <div className="relative z-30 flex min-w-0 flex-col justify-end gap-10 pt-6 md:gap-12 md:pt-16 lg:pt-32">
          <MovableBlock id="approach-how-works-cta">
            <div>
              <button
                type="button"
                className="flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-bold tracking-widest text-slate-900 shadow-lg shadow-slate-200/50 transition-all hover:scale-105 hover:bg-slate-50"
              >
                <span className="h-2 w-2 rounded-full bg-slate-900" />
                HOW OCC WORKS
              </button>
            </div>
          </MovableBlock>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-10 flex w-full max-w-[90rem] justify-end md:mt-16 md:-translate-y-12 lg:mt-20 lg:-translate-y-16 xl:-translate-y-20">
        <MovableBlock id="approach-image-card" className="w-full shrink-0 md:w-[60%]">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-blue-900/10">
            <img
              src="/Trivia.png"
              alt="Trivia Game Night — The Bike Lounge"
              className="h-full w-full object-cover"
            />
          </div>
        </MovableBlock>
      </div>

      <MovableBlock id="approach-tagline">
        <div className="relative z-20 mx-auto mt-20 w-full max-w-[90rem] text-center md:mt-32">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-600 md:text-base">
            Built for the ones who show up
          </p>
          <h3 className="mx-auto mt-4 max-w-[52rem] text-[1.75rem] font-medium leading-[1.15] tracking-tight text-slate-900 sm:text-[2.5rem] md:text-[3.25rem] lg:text-[4rem]">
            Where your campus ends, your community begins
          </h3>
          <p className="mx-auto mt-6 max-w-[40rem] text-base leading-relaxed text-slate-500 md:text-lg">
            Whether you're looking to have fun, learn something new, or earn on
            the side — OCC gives you a platform to do it all, in a way that
            feels natural, exciting, and truly yours.
          </p>
        </div>
      </MovableBlock>
    </section>
  );
}
