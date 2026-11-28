import React from "react";
import { Film, Ticket, BarChart3, Monitor } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const features = [
    {
      num: "01",
      icon: Ticket,
      title: "Box Office & Seat Maps",
      desc: "Real-time auditorium seat selection, counter quick-sales, and instant ticket printing.",
    },
    {
      num: "02",
      icon: Film,
      title: "Showtime & Screen Control",
      desc: "Manage multi-branch screening schedules, formats, and dynamic pricing rules.",
    },
    {
      num: "03",
      icon: Monitor,
      title: "Live Digital Signage",
      desc: "Broadcast automated now-showing carousels and concession menus to lobby displays.",
    },
    {
      num: "04",
      icon: BarChart3,
      title: "Audit-Ready Revenue Reports",
      desc: "Track ticket and concession revenue, VAT, and inventory movements in real time.",
    },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-[#fff8ea]">
      {/* Left Habyta-inspired Editorial Panel */}
      <div className="hidden md:flex md:col-span-6 bg-[#161310] text-[#fff8ea] p-12 flex-col justify-between border-r border-[#2a231c]">
        <div className="flex items-center gap-3">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="3"
              y="9"
              width="12"
              height="22"
              rx="3"
              fill="#fff8ea"
              opacity="0.45"
            />
            <rect x="18" y="5" width="13" height="26" rx="3" fill="#fff8ea" />
            <circle cx="24.5" cy="17" r="3" fill="#c77e3b" />
          </svg>
          <span className="font-display text-2xl font-bold tracking-tight text-[#fff8ea]">
            Cinema<span className="text-[#c77e3b]">OS</span>
          </span>
        </div>

        <div className="max-w-xl space-y-8 my-auto py-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-xs font-semibold uppercase tracking-[0.14em] text-[#fff8ea]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c77e3b]" />
              Theater Operations Platform
            </span>
            <h1 className="font-display text-3xl md:text-[44px] font-bold text-[#fff8ea] leading-[1.08] tracking-tight">
              Run every screen, counter, and lobby display from one place.
            </h1>
            <p className="text-base text-[#fff8ea]/70 leading-relaxed">
              Built for multi-branch cinema operators — pairing box office speed
              with room-by-room auditorium control and real-time financial
              reporting.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((item) => (
              <div
                key={item.num}
                className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-[#c77e3b]">
                    {item.num}
                  </span>
                  <item.icon className="w-4 h-4 text-[#fff8ea]/60" />
                </div>
                <h3 className="font-display text-sm font-bold text-[#fff8ea]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#fff8ea]/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#fff8ea]/50 pt-6 border-t border-white/10">
          <span>© {new Date().getFullYear()} CinemaOS Operations Suite</span>
          <span>Multi-Branch Theater Management</span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="md:col-span-6 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
