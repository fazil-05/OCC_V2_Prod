import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { AnalyticsClient } from "@/components/club-header/HeaderAnalytics";

export default async function HeaderAnalyticsPage() {
  const user = await requireUser();
  const [totalMembers, totalPosts] = await Promise.all([
    prisma.referralStat.count({ where: { clubHeaderId: user.id } }),
    prisma.post.count({ where: { userId: user.id } }),
  ]);
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[#8C6DFD] font-semibold mb-2">Insights</p>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Club <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] to-[#8C6DFD]">Analytics</span>
        </h1>
        <p className="mt-2 text-sm text-white/50">Track your club's growth and engagement metrics.</p>
      </div>
      <AnalyticsClient totalMembers={totalMembers} totalPosts={totalPosts} />
    </div>
  );
}
