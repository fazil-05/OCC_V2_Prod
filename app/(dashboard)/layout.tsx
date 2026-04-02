import { requireUser } from "@/lib/auth";
import { OCCSidebar } from "@/components/occ-dashboard/OCCSidebar";
import { OCCHeader } from "@/components/occ-dashboard/OCCHeader";
import { headers } from "next/headers";
import { Home, Search, MessageSquare, Plus, MessageCircle, User } from "lucide-react";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();
  const path = (await headers()).get("next-url") ?? "/dashboard";

  return (
    <div className="flex min-h-screen bg-[#F6F7FA] font-sans tracking-tight text-black overflow-hidden select-none">
      {/* Unified Navigation - Handles Sidebar & Bottom Nav */}
      <OCCSidebar activePath={path} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <OCCHeader user={user} />

        <main className="flex-1 overflow-y-auto px-0 sm:px-6 lg:px-10 pb-24 lg:pb-10 pt-2 sm:pt-8 bg-[#F6F7FA]">
          <div className="mx-auto w-full max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

