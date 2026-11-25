/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarCheck, CalendarOff, Layers, Monitor, PowerOff, Wifi, WifiOff } from "lucide-react";
import StatCards from "../../../components/shared/StatCards";
import { CONTENT_TYPES } from "../constants";

interface SignageAnalyticsProps {
  displays: any[];
  displayStats: any;
  contentStats: any;
  scheduleStats: any;
}

/** Health of the cinema's screens and what's in the library, from the lists' `stats`. */
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
  const offline = displays.filter((d) => d.is_powered_on && d.status === "offline");

  return (
    <div className="space-y-6">
      <StatCards
        items={[
          { label: "Displays", value: displayStats?.total_displays ?? 0, icon: Monitor },
          {
            label: "Online",
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
            label: "Powered off",
            value: displayStats?.powered_off_displays ?? 0,
            icon: PowerOff,
            tone: "warning",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="font-sans font-semibold text-lg mb-1 flex items-center gap-2">
            <Layers className="w-5 h-5" /> Content library
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{totalContent} item(s) by type</p>
          <div className="space-y-3">
            {contentBreakdown.map(({ type, count }) => {
              const meta = CONTENT_TYPES[type];
              const Icon = meta.icon;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" /> {meta.label}
                    </span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded">
                    <div
                      className="h-2 bg-[#c77e3b] rounded"
                      style={{ width: `${totalContent ? (count / totalContent) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h3 className="font-sans font-semibold text-lg">Schedules</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-green-50 p-4">
              <CalendarCheck className="w-5 h-5 text-green-700 mb-1" />
              <p className="text-2xl font-bold">{scheduleStats?.active_schedules ?? 0}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <CalendarOff className="w-5 h-5 text-gray-500 mb-1" />
              <p className="text-2xl font-bold">{scheduleStats?.inactive_schedules ?? 0}</p>
              <p className="text-sm text-muted-foreground">Paused</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {scheduleStats?.all_display_schedules ?? 0} of {scheduleStats?.total_schedules ?? 0} play on every display.
          </p>

          {offline.length > 0 && (
            <div className="border-t pt-4">
              <p className="font-medium text-sm mb-2 text-red-700">Switched on but not checking in</p>
              <ul className="text-sm space-y-1">
                {offline.map((d) => (
                  <li key={d.display_id} className="flex justify-between gap-2">
                    <span>{d.name}</span>
                    <span className="text-muted-foreground">{d.location}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                Check the screen's network connection and that its player has the right key.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
