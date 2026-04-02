"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

type Member = {
  id: string;
  student: {
    fullName: string;
    collegeName: string;
    createdAt: string;
  };
  registeredAt: string;
};

export function MembersTable({ members }: { members: Member[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-[2rem] border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl shadow-2xl"
    >
      <table className="w-full text-left text-sm text-[#F5F1EB]">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-white/40 font-semibold">#</th>
            <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-white/40 font-semibold">Name</th>
            <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-white/40 font-semibold">College</th>
            <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-white/40 font-semibold">Joined</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, idx) => (
            <motion.tr
              key={m.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="border-t border-white/[0.04] hover:bg-[#5227FF]/[0.06] transition-colors group"
            >
              <td className="px-6 py-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-xs font-bold text-white/50 group-hover:bg-[#5227FF]/20 group-hover:text-[#8C6DFD] transition-colors">
                  {idx + 1}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#12183A] to-[#0A0D20] border border-white/10 text-xs font-bold text-white">
                    {m.student.fullName.charAt(0)}
                  </div>
                  <span className="font-medium text-white/90">{m.student.fullName}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-white/60">{m.student.collegeName}</td>
              <td className="px-6 py-4 text-white/40 text-xs">
                {formatDistanceToNow(new Date(m.registeredAt), { addSuffix: true })}
              </td>
            </motion.tr>
          ))}
          {members.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-white/30">
                No members yet. Share your referral code to grow your club!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}
