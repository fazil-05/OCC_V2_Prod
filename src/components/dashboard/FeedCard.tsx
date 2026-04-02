import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Sparkles, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export function FeedCard({
  post,
}: {
  post: {
    imageUrl: string;
    caption?: string | null;
    likes: number;
    club: { name: string; icon: string };
    user: { fullName: string; avatar?: string };
    createdAt?: string;
  };
}) {
  return (
    <GlassCard className="group relative overflow-hidden rounded-[3.5rem] border-0 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.25)]">
      {/* 
        Creative Split Layout Architecture 
        Left: Media Core
        Right: Intel Core 
      */}
      <div className="grid lg:grid-cols-[1.3fr_1fr] h-full min-h-[650px]">
        
        {/* Left Side: Immersive Visual Media */}
        <div className="relative overflow-hidden bg-black">
          <img 
            src={post.imageUrl} 
            alt={post.caption || "Elite Post"} 
            className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-90 brightness-[0.85] contrast-[1.1]"
          />
          {/* Subtle Creative Overlays */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
          <div className="absolute inset-0 bg-[#5227FF]/5 mix-blend-overlay" />
          
          <div className="absolute left-10 bottom-10 z-20 flex items-center gap-4">
             <div className="h-16 w-16 overflow-hidden rounded-full ring-4 ring-white/20 backdrop-blur-3xl shadow-2xl">
               <img src={post.user.avatar || post.imageUrl} className="h-full w-full object-cover" />
             </div>
             <div className="flex flex-col">
               <div className="flex items-center gap-2">
                 <span className="text-[18px] font-black text-white tracking-tight">{post.user.fullName}</span>
                 <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
               </div>
               <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Premium Member</span>
             </div>
          </div>
        </div>

        {/* Right Side: High-End Details Panel */}
        <div className="flex flex-col h-full bg-[#fcfcfc] p-12 lg:p-14 relative">
          {/* Context Header */}
          <div className="flex items-center justify-between mb-10 pb-10 border-b border-black/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-black/5 text-xl">{post.club.icon}</div>
              <div className="flex flex-col">
                <span className="text-[14px] font-black uppercase tracking-[0.2em] text-black/90">{post.club.name}</span>
                <span className="text-[11px] font-bold text-black/20">{post.createdAt || "2h ago"} • Private Feed</span>
              </div>
            </div>
            <button className="h-12 px-8 rounded-full border-2 border-black/5 text-[11px] font-black uppercase tracking-[0.3em] text-black hover:bg-black hover:text-white hover:border-black transition-all">
              Follow
            </button>
          </div>

          {/* Description - Editorial Style */}
          <div className="flex-1 space-y-8 overflow-y-auto scrollbar-hide py-4">
            <div className="space-y-4">
              <h4 className="font-serif italic text-4xl text-black leading-tight">
                {post.caption ? post.caption.split('.')[0] + '.' : "A defining moment."}
              </h4>
              <p className="text-[18px] font-medium leading-relaxed text-black/50">
                {post.caption || "Experience the pinnacle of student networking. This is more than a post, it's a statement of ambition and style."}
              </p>
            </div>

            {/* Elite Tags as Pills */}
            <div className="flex flex-wrap gap-2 pt-4">
              {['Elite', 'Ambition', 'Networking', 'Exclusive'].map(tag => (
                <span key={tag} className="px-5 py-2 rounded-full border border-black/[0.03] bg-black/[0.01] text-[10px] font-black uppercase tracking-[0.2em] text-black/30">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Hub - Premium Interaction */}
          <div className="mt-auto pt-10 border-t border-black/5">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 group">
                  <Heart className="h-6 w-6 text-black/20 group-hover:text-[#FF3040] group-hover:scale-125 transition-all" />
                  <span className="text-[14px] font-black text-black/80">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 group">
                  <MessageCircle className="h-6 w-6 text-black/20 group-hover:text-[#5227FF] group-hover:scale-125 transition-all" />
                  <span className="text-[14px] font-black text-black/80">32</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 rounded-xl hover:bg-black/5 transition-all">
                  <Share2 className="h-5 w-5 text-black/20" />
                </button>
                <button className="p-3 rounded-xl hover:bg-black/5 transition-all">
                  <Bookmark className="h-5 w-5 text-black/20" />
                </button>
              </div>
            </div>

            {/* Exclusive Comment Input */}
            <div className="relative group/input">
              <div className="absolute inset-0 bg-[#5227FF] blur-xl opacity-0 group-focus-within/input:opacity-5 transition-all" />
              <input 
                type="text" 
                placeholder="Share your elite perspective..."
                className="w-full h-16 rounded-2xl bg-black/[0.02] border border-black/5 px-8 text-[14px] font-bold text-black outline-none placeholder:text-black/20 transition-all focus:bg-white focus:shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
