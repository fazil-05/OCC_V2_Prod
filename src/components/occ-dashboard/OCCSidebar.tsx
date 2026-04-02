"use client";

import { 
  Diamond, 
  Network, 
  Sparkle, 
  Shapes,
  Menu,
  Infinity,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLogout } from "@/hooks/useLogout";

// OCC PREMIUM ICON MAPPINGS
const navItems = [
  { icon: Diamond, label: "Home", href: "/dashboard" },
  { icon: Network, label: "Explore", href: "/explore" }, 
  { icon: Sparkle, label: "Notifications", href: "/notifications" },
  { icon: Shapes, label: "Clubs", href: "/clubs" },     
];

export function OCCSidebar({ activePath }: { activePath: string }) {
  const pathname = usePathname();
  const logout = useLogout();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={false}
        animate={{ width: isHovered ? 240 : 72 }}
        transition={{ type: "spring", stiffness: 350, damping: 35 }}
        style={{ backgroundColor: 'black' }}
        className="hidden lg:flex shrink-0 border-r border-white/10 flex-col h-screen sticky top-0 z-[100] transition-all duration-300 overflow-hidden"
      >
        {/* Brand Identity Section */}
        <div className="pt-10 px-6 pb-12 h-24 flex items-center">
          <Link href="/dashboard" className="flex items-center gap-4 group">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5227FF] via-[#2B4BFF] to-[#D4AF37] text-white shadow-[0_0_30px_rgba(82,39,255,0.3)] transition-transform group-hover:scale-110 group-hover:rotate-12">
              <Infinity className="h-7 w-7 text-white" strokeWidth={3} />
            </div>
            <AnimatePresence>
              {isHovered && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  style={{ color: 'white' }}
                  className="text-2xl font-black tracking-tighter text-white"
                >
                  OCC
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 flex flex-col gap-3 px-4 mt-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.label === "Home" && pathname === "/dashboard");
            return (
              <Link 
                key={item.label}
                href={item.href}
                className={`group flex h-14 items-center rounded-2xl px-4 transition-all duration-300 relative ${
                  isActive 
                    ? "bg-white/10" 
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-center w-7 h-7 shrink-0 relative">
                  <motion.div
                    animate={isActive ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.3, rotate: -8 }}
                    transition={{ 
                      scale: { type: "spring", stiffness: 400, damping: 15 },
                      rotate: { type: "tween", duration: 0.3 }
                    }}
                  >
                    <item.icon 
                      className={`h-7 w-7 transition-colors duration-300 ${isActive ? "text-[#D4AF37]" : "text-white/40 group-hover:text-white"}`} 
                      strokeWidth={isActive ? 3 : 2.5}
                      style={{ stroke: 'currentColor' }} 
                    />
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {isHovered && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      style={{ color: 'white' }}
                      className={`ml-5 text-[17px] whitespace-nowrap text-white group-hover:translate-x-1 transition-transform ${isActive ? "font-black" : "font-semibold"}`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-2 h-10 bg-[#D4AF37] rounded-r-full shadow-[0_0_20px_rgba(212,175,55,0.6)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 pb-12">
          <button 
            onClick={logout}
            className="flex h-16 w-full items-center rounded-2xl px-4 hover:bg-red-500/10 transition-all group"
          >
            <div className="flex items-center justify-center w-7 h-7 shrink-0 transition-transform group-hover:scale-110">
              <LogOut className="h-8 w-8 text-white/50 group-hover:text-red-400" strokeWidth={3} />
            </div>
            {isHovered && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-5 text-[18px] font-black text-red-500/80 group-hover:text-red-400">Logout</motion.span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* MOBILE BOTTOM NAVIGATION - PREMIUM FIT */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/90 backdrop-blur-2xl border-t border-white/10 z-[100] lg:hidden flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.label === "Home" && pathname === "/dashboard");
          return (
            <Link 
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              <div className="relative">
                <item.icon 
                  className={`h-6 w-6 transition-all duration-300 ${isActive ? "text-[#D4AF37] scale-110" : "text-white/40"}`} 
                  strokeWidth={isActive ? 3 : 2.5}
                />
                {isActive && (
                  <motion.div 
                    layoutId="mobile-nav-glow"
                    className="absolute -inset-4 bg-[#D4AF37]/20 blur-xl rounded-full -z-10"
                  />
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.1em] mt-1.5 transition-colors ${isActive ? "text-[#D4AF37]" : "text-white/20"}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="mobile-nav-indicator"
                  className="absolute top-0 w-8 h-1 bg-[#D4AF37] rounded-b-full shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                />
              )}
            </Link>
          );
        })}
        {/* Settings/Menu on mobile */}
        <button className="flex flex-col items-center justify-center w-16 h-full text-white/40">
          <Menu className="h-6 w-6" strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-[0.1em] mt-1.5">More</span>
        </button>
      </nav>
    </>
  );
}

