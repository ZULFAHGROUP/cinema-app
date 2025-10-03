/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag, Switch } from "antd";
import Button from "../../../components/shared/Button";
import {
  Wifi,
  WifiOff,
  Play,
  Pause,
  RotateCcw,
  Monitor,
  Power,
  Volume2,
  PanelRightClose as Brightness4,
} from "lucide-react";

interface DisplaysManagementProps {
  displays: any[];
  selectedDisplay: string;
  setSelectedDisplay: (id: string) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export default function DisplaysManagement({
  displays,
  selectedDisplay,
  setSelectedDisplay,
  isPlaying,
  setIsPlaying,
}: DisplaysManagementProps) {
  const currentDisplay = displays.find((d) => d.id === selectedDisplay);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Display List */}
      <div className="lg:col-span-1">
        <div className="border rounded-lg p-6">
          <h3 className="font-sans font-semibold text-lg mb-2">
            Active Displays
          </h3>
          <p className="text-sm text-muted-foreground font-serif mb-4">
            Manage your digital displays
          </p>
          <div className="space-y-3">
            {displays.map((display) => (
              <div
                key={display.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedDisplay === display.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => setSelectedDisplay(display.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif font-medium">{display.name}</h4>
                  <div className="flex items-center gap-1">
                    {display.status === "online" ? (
                      <Wifi className="w-4 h-4 text-green-600" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-600" />
                    )}
                    <Tag color={display.status === "online" ? "green" : "red"}>
                      {display.status}
                    </Tag>
                  </div>
                </div>
                <p className="font-serif text-sm text-muted-foreground">
                  {display.location}
                </p>
                <p className="font-serif text-xs text-muted-foreground mt-1">
                  {display.content} • {display.resolution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Display Preview */}
      <div className="lg:col-span-2">
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-sans font-semibold text-lg">
                {currentDisplay?.name}
              </h3>
              <p className="text-sm text-muted-foreground font-serif">
                {currentDisplay?.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsPlaying(!isPlaying)}
                icon={
                  isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )
                }
                title={isPlaying ? "Pause" : "Play"}
                className="rounded-md"
              />
              <Button
                variant="outline"
                icon={<RotateCcw className="w-4 h-4" />}
                title="Refresh"
                className="rounded-md"
              />
            </div>
          </div>

          {/* Display Preview */}
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center mb-4">
            <div className="text-center text-white">
              <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="font-serif text-lg mb-2">
                {currentDisplay?.content}
              </p>
              <p className="font-serif text-sm opacity-75">
                {currentDisplay?.resolution}
              </p>
            </div>
          </div>

          {/* Display Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="font-serif text-sm block">Power</label>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Power className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-serif text-sm block">Volume</label>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="75"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-serif text-sm block">Brightness</label>
              <div className="flex items-center gap-2">
                <Brightness4 className="w-4 h-4" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="80"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-serif text-sm block">Status</label>
              <Tag
                color={currentDisplay?.status === "online" ? "green" : "red"}
                className="w-full text-center"
              >
                {currentDisplay?.status}
              </Tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
