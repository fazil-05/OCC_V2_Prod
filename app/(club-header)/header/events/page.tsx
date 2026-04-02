"use client";

import { motion } from "framer-motion";
import { CalendarDays, Sparkles } from "lucide-react";

export default function HeaderEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[#8C6DFD] font-semibold mb-2">Manage</p>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Club <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] to-[#8C6DFD]">Events</span>
        </h1>
        <p className="mt-2 text-sm text-white/50">Create and manage events for your club members.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center rounded-[2rem] border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl p-16 relative overflow-hidden"
      >
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 h-[300px] w-[300px] rounded-full bg-[#5227FF]/15 blur-[100px] pointer-events-none" />

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 mb-8"
        >
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-[#5227FF]/20 to-transparent border border-[#5227FF]/20 flex items-center justify-center">
            <CalendarDays className="h-10 w-10 text-[#8C6DFD]" />
          </div>
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-3 relative z-10">Coming Soon</h2>
        <p className="text-white/40 text-center max-w-md relative z-10 mb-8">
          Event creation and management tools are being built. You&apos;ll be able to create events, track registrations, and manage attendees.
        </p>

        <div className="flex items-center gap-2 rounded-full border border-[#5227FF]/30 bg-[#5227FF]/10 px-5 py-2.5 relative z-10">
          <Sparkles className="h-4 w-4 text-[#8C6DFD]" />
          <span className="text-sm font-semibold text-[#8C6DFD]">In Development</span>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#5227FF] rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                opacity: [0.1, 0.6, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
