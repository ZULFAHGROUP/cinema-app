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

const TONES: Record<StatTone, string> = {
  neutral: "bg-[#fff8ea] text-[#c77e3b]",
  good: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
};

/**
 * Summary cards above a table. Values come from the list's `stats`, which the API
 * totals over every row the current search and filters match, not just this page.
 */
const StatCards = ({ items, loading }: { items: StatCardItem[]; loading?: boolean }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {items.map((item) => {
      const Icon = item.icon;
      const content = (
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg shrink-0 ${TONES[item.tone || "neutral"]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground font-serif truncate">
              {item.label}
            </p>
            <p className={`text-lg md:text-2xl font-sans font-bold ${loading ? "opacity-40" : ""}`}>
              {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
            </p>
            {item.hint && <p className="text-xs text-muted-foreground truncate">{item.hint}</p>}
          </div>
        </div>
      );
      const base = "bg-white border rounded-lg p-4 text-left w-full";
      return item.onClick ? (
        <button
          key={item.label}
          type="button"
          onClick={item.onClick}
          className={`${base} cursor-pointer transition hover:border-[#c77e3b] ${
            item.active ? "border-[#c77e3b] ring-1 ring-[#c77e3b]" : ""
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
