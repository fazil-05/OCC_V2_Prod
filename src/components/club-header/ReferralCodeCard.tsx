"use client";

import { useState } from "react";
import { Copy, QrCode, Share2, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";

export function ReferralCodeCard({ code, clubName }: { code: string; clubName: string }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${code}`;

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const shareLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[2rem] border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl p-8 relative overflow-hidden"
    >
      <div className="absolute top-[-20%] left-[-10%] h-[200px] w-[200px] rounded-full bg-[#5227FF]/15 blur-[80px] pointer-events-none" />

      <div className="relative z-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#8C6DFD] font-semibold mb-6">
          Your Referral Code
        </p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" as const, stiffness: 300, damping: 25 }}
          className="rounded-2xl border border-[#5227FF]/30 bg-gradient-to-br from-[#5227FF]/15 to-transparent px-6 py-8 text-center mb-6"
        >
          <p className="font-mono text-[clamp(32px,6vw,72px)] tracking-[0.3em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] to-[#8C6DFD]">
            {code}
          </p>
        </motion.div>

        <p className="text-sm text-white/60 mb-6">
          Share this code to invite students into <span className="text-white font-semibold">{clubName}</span>.
        </p>

        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={copy}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5227FF] to-[#2B4BFF] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(82,39,255,0.4)] hover:shadow-[0_0_25px_rgba(82,39,255,0.6)] transition-shadow"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied ✓" : "Copy Code"}
          </motion.button>

          <button
            onClick={() => setShowQr((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/5 px-5 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <QrCode className="h-4 w-4" />
            QR Code
          </button>

          <button
            onClick={shareLink}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/5 px-5 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <Share2 className="h-4 w-4" />
            Share Link
          </button>
        </div>

        {showQr && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 flex flex-col items-center gap-3"
          >
            <div className="inline-block rounded-2xl bg-white p-4 shadow-[0_0_30px_rgba(82,39,255,0.2)]">
              <QRCodeSVG value={shareUrl} size={160} />
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <ExternalLink className="h-3 w-3" />
              <span className="font-mono">{shareUrl.replace(/^https?:\/\//, "")}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
