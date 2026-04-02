import React from "react";
import { motion } from "motion/react";
import { MovableBlock } from "./LayoutEditor";

export function Experiences() {
  return (
    <section className="relative w-full max-w-[100vw] overflow-x-hidden bg-[#F6F7FA] px-4 py-24 sm:px-6 md:px-12 md:py-32">
      <MovableBlock
        id="experiences-bg-stroke"
        className="pointer-events-none absolute right-0 top-0 h-full w-full"
      >
        <svg
          viewBox="0 0 1000 1000"
          className="absolute -top-[10%] right-0 h-[120%] w-[120%] opacity-60"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M 1000 200 C 600 -100 200 400 300 800 C 400 1200 800 1000 1000 600"
            fill="none"
            stroke="#67E8F9"
            strokeWidth="60"
            strokeLinecap="round"
          />
        </svg>
      </MovableBlock>

      <div className="relative z-10 mx-auto mb-24 mt-12 w-full max-w-[90rem] md:mb-32 lg:mb-40">
        <MovableBlock id="experiences-title">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[2.75rem] font-medium leading-[0.92] tracking-tighter text-slate-900 sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[9rem]">
              Events, gigs,
              <br />
              and matchups
              <br />
              that hit different
            </h2>
          </motion.div>
        </MovableBlock>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[90rem] grid-cols-1 items-center gap-12 md:gap-20 lg:grid-cols-[1.5fr_1fr] lg:gap-32">
        <MovableBlock id="experiences-visual">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-black shadow-2xl shadow-cyan-900/10"
          >
            <div className="pointer-events-none absolute inset-0 z-20 rounded-[2rem] border-[12px] border-black shadow-inner md:border-[20px] lg:border-[24px]" />
            <img
              src="https://images.unsplash.com/photo-1583607309147-63470483c6e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc3Ryb25hdXQlMjBmbG9hdGluZyUyMGluJTIwc3BhY2UlMjBlYXJ0aCUyMHRhYmxldHxlbnwxfHx8fDE3NzQ5MzQ0ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Immersive OCC experience visual"
              className="z-10 h-full w-full object-cover"
            />
          </motion.div>
        </MovableBlock>

        <div className="flex flex-col justify-center gap-6 md:gap-8">
          <MovableBlock id="experiences-copy-brand">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="text-2xl font-medium tracking-widest text-slate-900">OCC</div>
            </motion.div>
          </MovableBlock>
          <MovableBlock id="experiences-copy-p1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.26 }}
            >
              <p className="text-lg font-medium leading-[1.4] text-slate-900 md:text-xl lg:text-[1.65rem]">
                We are not another generic campus feed. OCC is built for Gen Z who want real scenes
                off campus—trivia nights, open mics, movie screenings, pickup and turf blocks, and
                curated match setups when you want to play for real.
              </p>
            </motion.div>
          </MovableBlock>
          <MovableBlock id="experiences-copy-p2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.32 }}
            >
              <p className="text-base font-medium leading-[1.5] text-slate-800 md:text-lg lg:text-xl">
                Tap into gig listings when you want to earn, discover clubs by interest, and move
                with people who show up for the same energy—whether that is a bike loop, a lens
                crawl, or a lift session.
              </p>
            </motion.div>
          </MovableBlock>
        </div>
      </div>
    </section>
  );
}
