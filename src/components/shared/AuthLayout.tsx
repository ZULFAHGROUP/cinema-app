import { Carousel } from "antd";
import { Clapperboard, Film, Monitor, Ticket } from "lucide-react";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#fff8ea] flex flex-col lg:flex-row">
      {/* Left Cinema Showcase Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#2b1d12] via-[#4a301a] to-[#1b283d] p-12 flex-col justify-between text-white">
        {/* Ambient Spotlights */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#c77e3b]/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#5480c7]/25 blur-3xl pointer-events-none" />

        {/* Top Brand Emblem */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#c77e3b] to-[#754f2c] flex items-center justify-center shadow-lg shadow-[#c77e3b]/30">
            <Clapperboard className="w-6 h-6 text-[#fff8ea]" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#fff8ea]">
              Cinema<span className="text-[#c77e3b]">OS</span>
            </span>
            <p className="text-xs text-[#fff8ea]/70">Enterprise Theater Operations</p>
          </div>
        </div>

        {/* Middle Feature Cards */}
        <div className="relative z-10 my-auto py-8 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff8ea]/10 border border-[#fff8ea]/15 text-[#fff8ea] text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#c77e3b] animate-pulse" />
            All-in-One Cinema Management Suite
          </div>

          <Carousel autoplay className="max-w-lg">
            <div className="pr-4">
              <h2 className="text-3xl xl:text-4xl font-extrabold text-[#fff8ea] leading-tight">
                Run every screen, seat, and showtime with precision.
              </h2>
              <p className="text-sm text-[#fff8ea]/75 mt-3 leading-relaxed">
                Manage multi-location theaters, dynamic seat layouts, pricing rules, and box office sales from one unified command center.
              </p>
            </div>
            <div className="pr-4">
              <h2 className="text-3xl xl:text-4xl font-extrabold text-[#fff8ea] leading-tight">
                Real-time concessions, stock & digital signage.
              </h2>
              <p className="text-sm text-[#fff8ea]/75 mt-3 leading-relaxed">
                Track inventory movements across branches and control lobby screens live with automated showtime carousels.
              </p>
            </div>
            <div className="pr-4">
              <h2 className="text-3xl xl:text-4xl font-extrabold text-[#fff8ea] leading-tight">
                Actionable analytics & full audit transparency.
              </h2>
              <p className="text-sm text-[#fff8ea]/75 mt-3 leading-relaxed">
                Monitor ticket revenue, concession margins, VAT collections, and every staff action in real time.
              </p>
            </div>
          </Carousel>

          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Film className="w-5 h-5 text-[#c77e3b] mb-2" />
              <p className="text-xs font-bold text-[#fff8ea]">Smart Showtimes</p>
              <p className="text-[11px] text-[#fff8ea]/60 mt-0.5">Conflict-free slots</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Ticket className="w-5 h-5 text-[#c77e3b] mb-2" />
              <p className="text-xs font-bold text-[#fff8ea]">Box Office POS</p>
              <p className="text-[11px] text-[#fff8ea]/60 mt-0.5">Live seat holds</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Monitor className="w-5 h-5 text-[#5480c7] mb-2" />
              <p className="text-xs font-bold text-[#fff8ea]">Lobby Signage</p>
              <p className="text-[11px] text-[#fff8ea]/60 mt-0.5">Remote screen sync</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-[#fff8ea]/50 flex items-center justify-between">
          <span>CinemaOS Platform</span>
          <span>Secure Staff Portal</span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c77e3b] to-[#754f2c] flex items-center justify-center text-white shadow-md">
            <Clapperboard className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-stone-900">
            Cinema<span className="text-[#c77e3b]">OS</span>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
