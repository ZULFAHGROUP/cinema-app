import type { LucideIcon } from "lucide-react";

export type StatTone = "neutral" | "good" | "warning" | "danger" | "info";

export interface StatCardItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: StatTone;
  onClick?: () => void;
  active?: boolean;
}

const TONES: Record<StatTone, { badge: string; dot: string }> = {
  neutral: {
    badge: "bg-[#fff8ea] text-[#c77e3b] border border-[#e6dfd3]",
    dot: "bg-[#c77e3b]",
  },
  good: {
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200/70",
    dot: "bg-emerald-600",
  },
  warning: {
    badge: "bg-amber-50 text-amber-700 border border-amber-200/70",
    dot: "bg-amber-500",
  },
  danger: {
    badge: "bg-rose-50 text-rose-700 border border-rose-200/70",
    dot: "bg-rose-600",
  },
  info: {
    badge: "bg-[#5480c7]/10 text-[#5480c7] border border-[#5480c7]/20",
    dot: "bg-[#5480c7]",
  },
};

const StatCards = ({
  items,
  loading,
}: {
  items: StatCardItem[];
  loading?: boolean;
}) => (
  <div
    className={`grid grid-cols-1 ${
      items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
    } gap-4`}
  >
    {items.map((item) => {
      const Icon = item.icon;
      const tone = TONES[item.tone || "neutral"];
      const content = (
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-stone-500 truncate">
                {item.label}
              </p>
              {item.active && (
                <span className="px-1.5 py-0.5 rounded bg-[#c77e3b] text-white text-[9px] font-bold uppercase">
                  Active
                </span>
              )}
            </div>
            <p
              className={`font-display text-2xl md:text-[28px] font-bold text-[#12161c] mt-2 tracking-tight tabular-nums leading-none ${
                loading ? "opacity-40" : ""
              }`}
            >
              {typeof item.value === "number"
                ? item.value.toLocaleString()
                : item.value}
            </p>
            {item.hint && (
              <p className="text-xs text-stone-500 mt-2 truncate">
                {item.hint}
              </p>
            )}
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tone.badge}`}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>
      );
      const base =
        "bg-white border border-[#e6dfd3] rounded-2xl p-5 text-left w-full shadow-[0_1px_2px_rgba(18,22,28,0.05)] transition-colors duration-150";
      return item.onClick ? (
        <button
          key={item.label}
          type="button"
          onClick={item.onClick}
          className={`${base} cursor-pointer hover:border-[#c77e3b] ${
            item.active ? "border-[#c77e3b] bg-[#fffdf8]" : ""
          }`}
        >
          {content}
        </button>
      ) : (
        <div key={item.label} className={base}>
          {content}
        </div>
      );
    })}
  </div>
);

export default StatCards;
