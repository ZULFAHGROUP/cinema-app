/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag } from "antd";
import { Monitor, ImageIcon, Calendar, TrendingUp } from "lucide-react";

interface SignageAnalyticsProps {
  displays: any[];
  contentTemplates: any[];
  scheduleItems: any[];
}

export default function SignageAnalytics({
  displays,
  contentTemplates,
  scheduleItems,
}: SignageAnalyticsProps) {
  const activeDisplays = displays.filter((d) => d.status === "online").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-sm text-muted-foreground">
                Active Displays
              </p>
              <p className="font-sans text-2xl font-bold">
                {activeDisplays}/{displays.length}
              </p>
            </div>
            <Monitor className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-sm text-muted-foreground">
                Content Items
              </p>
              <p className="font-sans text-2xl font-bold">
                {contentTemplates.length}
              </p>
            </div>
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-sm text-muted-foreground">
                Scheduled Items
              </p>
              <p className="font-sans text-2xl font-bold">
                {scheduleItems.length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-sm text-muted-foreground">Uptime</p>
              <p className="font-sans text-2xl font-bold">99.2%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Display Performance */}
      <div className="border rounded-lg p-6">
        <h3 className="font-sans font-semibold text-lg mb-2">
          Display Performance
        </h3>
        <p className="text-sm text-muted-foreground font-serif mb-4">
          Monitor display health and performance
        </p>
        <div className="space-y-4">
          {displays.map((display) => (
            <div
              key={display.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    display.status === "online" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <div>
                  <p className="font-serif font-medium">{display.name}</p>
                  <p className="font-serif text-sm text-muted-foreground">
                    Last update: {display.lastUpdate}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Tag
                  color={display.status === "online" ? "green" : "red"}
                >
                  {display.status}
                </Tag>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}