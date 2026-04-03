import React from "react";
import { Activity } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "@/lib/router-compat";
import { MovableBlock } from "./LayoutEditor";
import { navigateForAuth } from "@/lib/client-auth-redirect";
import { scrollToOccClubsSection } from "@/lib/landingNav";

export function Header() {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 xs:px-6 xs:py-6 md:px-12 pointer-events-none"
    >
      <MovableBlock
        id="header-logo"
        className="pointer-events-auto select-none text-xl xs:text-2xl font-black tracking-widest text-white drop-shadow-sm font-sans"
      >
        OCC
      </MovableBlock>

      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
        <MovableBlock id="header-activity-btn" className="hidden xs:flex">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200/50 backdrop-blur-md transition-colors hover:bg-slate-200"
          >
            <Activity size={16} className="text-slate-800" />
          </button>
        </MovableBlock>
        
        {/* Mobile-only compact Join button */}
        <MovableBlock id="header-mobile-join-btn" className="flex sm:hidden">
          <button
            type="button"
            onClick={() => navigateForAuth(navigate, "/explore", "/login")}
            className="flex items-center justify-center rounded-full bg-slate-800 px-4 py-2 text-[10px] font-bold tracking-wider text-white backdrop-blur-md"
          >
            JOIN
          </button>
        </MovableBlock>

        {/* Desktop-only full buttons */}
        <MovableBlock id="header-join-club-btn" className="hidden sm:flex">
          <button
            type="button"
            onClick={() =>
              navigateForAuth(navigate, "/explore", "/login")
            }
            className="flex items-center justify-center rounded-full bg-slate-800 px-5 py-2.5 text-xs font-semibold tracking-wider text-white backdrop-blur-md transition-colors hover:bg-slate-900"
          >
            JOIN A CLUB{" "}
            <span className="ml-2 inline-block h-1 w-1 rounded-full bg-white/70" />
          </button>
        </MovableBlock>
        <MovableBlock id="header-clubs-btn" className="hidden sm:flex">
          <button
            type="button"
            onClick={() => scrollToOccClubsSection()}
            className="flex items-center justify-center rounded-full bg-slate-200/50 px-5 py-2.5 text-xs font-semibold tracking-wider text-slate-900 backdrop-blur-md transition-colors hover:bg-slate-200"
          >
            CLUBS{" "}
            <span className="ml-2 flex gap-[2px]">
              <span className="h-1 w-1 rounded-full bg-slate-900/70" />
              <span className="h-1 w-1 rounded-full bg-slate-900/70" />
            </span>
          </button>
        </MovableBlock>
      </div>
    </motion.header>
  );
}
