import React from "react";
import { Play } from "lucide-react";
import { motion } from "motion/react";
import { MovableBlock } from "./LayoutEditor";

export function VideoReel() {
  return (
    <section className="relative w-full max-w-[100vw] overflow-x-hidden px-4 py-10 sm:px-6 md:px-12 md:py-12 bg-[#F6F7FA]">
      <div className="mx-auto flex w-full max-w-[90rem] items-center justify-between pb-10 font-bold text-slate-500 md:pb-12">
        {[0, 1, 2, 3, 4].map((i) => (
          <MovableBlock key={`video-reel-top-plus-${i}`} id={`video-reel-decor-top-${i}`}>
            <span>+</span>
          </MovableBlock>
        ))}
      </div>

      <MovableBlock id="video-reel-main" className="mx-auto w-full max-w-[90rem]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="group relative aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-[2rem] md:aspect-[21/9]"
        >
          <img
            src="https://images.unsplash.com/photo-1758598305805-4b9d79ae89bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwbG9va2luZyUyMGF0JTIwY2FtZXJhJTIwdmlkZW98ZW58MXx8fHwxNzc0OTM0NDgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Students at an OCC campus event"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 sm:gap-6 md:gap-8"
            >
              <MovableBlock id="video-reel-text-campus">
                <span className="text-3xl font-medium tracking-tight text-white sm:text-5xl md:text-7xl lg:text-9xl">
                  CAMPUS
                </span>
              </MovableBlock>
              <MovableBlock id="video-reel-play-control">
                <div className="flex h-12 w-16 items-center justify-center rounded-full bg-white shadow-xl sm:h-16 sm:w-24 md:h-20 md:w-32 lg:h-24 lg:w-40">
                  <Play className="ml-1 h-5 w-5 fill-current text-slate-900 sm:h-7 sm:w-7 md:h-10 md:w-10" />
                </div>
              </MovableBlock>
              <MovableBlock id="video-reel-text-reel">
                <span className="text-3xl font-medium tracking-tight text-white sm:text-5xl md:text-7xl lg:text-9xl">
                  REEL
                </span>
              </MovableBlock>
            </motion.div>
          </div>
        </motion.div>
      </MovableBlock>

      <div className="mx-auto flex w-full max-w-[90rem] items-center justify-between pt-10 font-bold text-slate-500 md:pt-12">
        {[0, 1, 2, 3, 4].map((i) => (
          <MovableBlock key={`video-reel-bottom-plus-${i}`} id={`video-reel-decor-bottom-${i}`}>
            <span>+</span>
          </MovableBlock>
        ))}
      </div>
    </section>
  );
}
