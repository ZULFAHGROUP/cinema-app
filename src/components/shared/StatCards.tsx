import type { LucideIcon } from "lucide-react";

export type StatTone = "neutral" | "good" | "warning" | "danger" | "info";

export interface StatCardItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  /** Small line under the value, e.g. "of 120 orders". */
  hint?: string;
  tone?: StatTone;
  /** Makes the card a filter shortcut; `active` highlights it. */
  onClick?: () => void;
  active?: boolean;
}

const TONES: Record<StatTone, { badge: string; bar: string }> = {
  neutral: {
    badge: "bg-[#fff8ea] text-[#c77e3b] ring-1 ring-[#c77e3b]/20",
    bar: "bg-[#c77e3b]",
  },
  good: {
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    bar: "bg-emerald-500",
  },
  warning: {
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    bar: "bg-amber-500",
  },
  danger: {
    badge: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    bar: "bg-rose-500",
  },
  info: {
    badge: "bg-[#5480c7]/10 text-[#5480c7] ring-1 ring-[#5480c7]/20",
    bar: "bg-[#5480c7]",
  },
};

/**
 * Summary cards above a table. Values come from the list's `stats`, which the API
 * totals over every row the current search and filters match, not just this page.
 */
const StatCards = ({ items, loading }: { items: StatCardItem[]; loading?: boolean }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {items.map((item) => {
      const Icon = item.icon;
      const tone = TONES[item.tone || "neutral"];
      const content = (
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 truncate">
              {item.label}
            </p>
            <p
              className={`text-2xl md:text-3xl font-extrabold text-stone-900 mt-1.5 tracking-tight ${
                loading ? "opacity-40" : ""
              }`}
            >
              {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
            </p>
            {item.hint && (
              <p className="text-xs text-stone-500 mt-1 truncate">{item.hint}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl shrink-0 shadow-2xs ${tone.badge}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      );
      const base =
        "relative overflow-hidden bg-white border border-[#c77e3b]/15 rounded-2xl p-5 text-left w-full shadow-[0_4px_16px_-4px_rgba(117,79,44,0.06)] transition-all duration-200";
      return item.onClick ? (
        <button
          key={item.label}
          type="button"
          onClick={item.onClick}
          className={`${base} cursor-pointer hover:-translate-y-0.5 hover:border-[#c77e3b]/50 hover:shadow-md ${
            item.active
              ? "border-[#c77e3b] ring-2 ring-[#c77e3b]/30 bg-[#fff8ea]/30"
              : ""
          }`}
        >
          <span className={`absolute top-0 left-0 right-0 h-1 ${tone.bar}`} />
          {content}
        </button>
      ) : (
        <div key={item.label} className={base}>
          <span className={`absolute top-0 left-0 right-0 h-1 ${tone.bar}`} />
          {content}
        </div>
      );
    })}
  </div>
);

export default StatCards;
