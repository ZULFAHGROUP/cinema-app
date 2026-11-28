/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CalendarCheck,
  CalendarOff,
  Layers,
  Monitor,
  PowerOff,
  Wifi,
  WifiOff,
} from "lucide-react";
import StatCards from "../../../components/shared/StatCards";
import { CONTENT_TYPES } from "../constants";

interface SignageAnalyticsProps {
  displays: any[];
  displayStats: any;
  contentStats: any;
  scheduleStats: any;
}

export default function SignageAnalytics({
  displays,
  displayStats,
  contentStats,
  scheduleStats,
}: SignageAnalyticsProps) {
  const contentBreakdown = [
    { type: "movie_carousel", count: contentStats?.movie_carousels ?? 0 },
    { type: "menu_display", count: contentStats?.menu_displays ?? 0 },
    { type: "promotional", count: contentStats?.promotional ?? 0 },
    { type: "information", count: contentStats?.information ?? 0 },
  ] as const;
  const totalContent = contentStats?.total_contents ?? 0;
  const offline = displays.filter(
    (d) => d.is_powered_on && d.status === "offline"
  );

  return (
    <div className="space-y-6">
      <StatCards
        items={[
          {
            label: "Total Displays",
            value: displayStats?.total_displays ?? 0,
            icon: Monitor,
          },
          {
            label: "Online & Active",
            value: displayStats?.online_displays ?? 0,
            hint: "Checked in within 90 seconds",
            icon: Wifi,
            tone: "good",
          },
          {
            label: "Offline",
            value: displayStats?.offline_displays ?? 0,
            icon: WifiOff,
            tone: displayStats?.offline_displays ? "danger" : "neutral",
          },
          {
            label: "Powered Off",
            value: displayStats?.powered_off_displays ?? 0,
            icon: PowerOff,
            tone: "warning",
          },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e6dfd3] rounded-2xl p-6 shadow-[0_1px_2px_rgba(18,22,28,0.05)]">
          <h3 className="font-display font-bold text-lg text-[#12161c] mb-0.5 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#c77e3b]" /> Content Library
            Breakdown
          </h3>
          <p className="text-xs text-[#686259] mb-5">
            {totalContent} media item(s) categorized by format
          </p>
          <div className="space-y-3.5">
            {contentBreakdown.map(({ type, count }) => {
              const meta = CONTENT_TYPES[type];
              const Icon = meta.icon;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#12161c] mb-1.5">
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#c77e3b]" /> {meta.label}
                    </span>
                    <span className="font-bold text-[#12161c]">
                      {count}
                    </span>
                  </div>
                  <div className="h-2 bg-[#faf6ed] border border-[#e6dfd3] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c77e3b] rounded-full"
                      style={{
                        width: `${
                          totalContent ? (count / totalContent) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-[#e6dfd3] rounded-2xl p-6 space-y-4 shadow-[0_1px_2px_rgba(18,22,28,0.05)]">
          <h3 className="font-display font-bold text-lg text-[#12161c]">
            Schedule Health
          </h3>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-4">
              <CalendarCheck className="w-5 h-5 text-emerald-700 mb-1" />
              <p className="text-2xl font-extrabold text-stone-900">
                {scheduleStats?.active_schedules ?? 0}
              </p>
              <p className="text-xs font-semibold text-emerald-800">
                Active Schedules
              </p>
            </div>
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
              <CalendarOff className="w-5 h-5 text-stone-500 mb-1" />
              <p className="text-2xl font-extrabold text-stone-900">
                {scheduleStats?.inactive_schedules ?? 0}
              </p>
              <p className="text-xs font-semibold text-stone-500">
                Paused Schedules
              </p>
            </div>
          </div>
          <p className="text-xs text-stone-500">
            {scheduleStats?.all_display_schedules ?? 0} of{" "}
            {scheduleStats?.total_schedules ?? 0} schedules broadcast across
            every display in this cinema.
          </p>

          {offline.length > 0 && (
            <div className="border-t border-stone-100 pt-4">
              <p className="font-bold text-xs uppercase tracking-wider mb-2 text-rose-700">
                Powered On But Not Checking In
              </p>
              <ul className="text-xs space-y-1.5">
                {offline.map((d) => (
                  <li
                    key={d.display_id}
                    className="flex justify-between gap-2 p-2 rounded-lg bg-rose-50/60 border border-rose-100"
                  >
                    <span className="font-bold text-stone-800">{d.name}</span>
                    <span className="text-stone-500">{d.location}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
