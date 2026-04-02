"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/app/components/ui/utils";

type PremiumButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel?: string;
};

export function PremiumButton({
  className,
  children,
  loading = false,
  loadingLabel,
  disabled,
  ...props
}: PremiumButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-14 w-full items-center justify-center gap-3 rounded-md border border-[#DCC07E]/60 bg-[#C9A96E] px-5 text-[13px] font-medium tracking-[0.3em] text-[#0C0C0A] transition duration-300 hover:shadow-[0_0_30px_rgba(201,169,110,0.28)] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      <span>{loading ? loadingLabel ?? children : children}</span>
    </button>
  );
}
