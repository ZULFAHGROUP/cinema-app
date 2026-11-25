/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { Dropdown, Input, Select, Slider, Switch, Tag } from "antd";
import {
  Edit,
  History,
  KeyRound,
  Monitor,
  MoreVertical,
  Pause,
  Play,
  Power,
  RotateCcw,
  Sun,
  Trash2,
  Volume2,
  Wifi,
  WifiOff,
} from "lucide-react";
import Button from "../../../components/shared/Button";
import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
import Loader from "../../../components/shared/Loader";
import Signage, { DisplayControls } from "../../../services/network/signage";
import { humanDateAndTime } from "../../../utils";
import { CONTENT_TYPES, PLAYLIST_MODES } from "../constants";
import DisplayModal from "../../../components/shared/Modal/DisplayModal";
import RecordHistory from "../../../components/shared/RecordHistory";
import { useAppSelector } from "../../../store/hook";

interface DisplaysManagementProps {
  displays: any[];
  cinemaId?: string;
  /** Runs an API call, reloads what it affects and toasts the result. */
  run: (action: () => Promise<any>, reload?: Array<() => Promise<void>>) => Promise<any>;
  loadDisplays: () => Promise<void>;
  onEdit: (display: any) => void;
  onNewKey: (display: any, key: string) => void;
}

/** One playlist entry as the screen would show it, in miniature. */
function PlaylistItem({ item }: { item: any }) {
  const type = CONTENT_TYPES[item.type as keyof typeof CONTENT_TYPES];
  const Icon = type?.icon || Monitor;
  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="aspect-video bg-gray-900 flex items-center justify-center text-white">
        {item.media_url && item.media_kind === "video" ? (
          <video src={item.media_url} className="w-full h-full object-cover" muted />
        ) : item.media_url ? (
          <img src={item.media_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center px-2">
            <Icon className="w-6 h-6 mx-auto mb-1 opacity-70" />
            <p className="text-[10px] opacity-80 line-clamp-2">
              {item.data?.movies
                ? `${item.data.movies.length} movie(s) showing`
                : item.data?.categories
                ? `${item.data.categories.length} menu categor${item.data.categories.length === 1 ? "y" : "ies"}`
                : item.description || item.name}
            </p>
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-medium truncate">{item.name}</p>
        <p className="text-[10px] text-muted-foreground">
          {type?.label} · {item.duration_seconds}s
        </p>
      </div>
    </div>
  );
}

export default function DisplaysManagement({
  displays,
  cinemaId,
  run,
  loadDisplays,
  onEdit,
  onNewKey,
}: DisplaysManagementProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [controls, setControls] = useState<DisplayControls>({});
  const [toDelete, setToDelete] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const { user } = useAppSelector((state) => state.accounts.data);
  // The audit timeline needs view_audit_logs, which only Admins have.
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const current = displays.find((d) => d.display_id === selectedId) || displays[0];

  // Sliders follow the saved values whenever a different display is picked or reloaded.
  useEffect(() => {
    if (current) {
      setControls({
        is_powered_on: current.is_powered_on,
        is_paused: current.is_paused,
        volume: current.volume,
        brightness: current.brightness,
      });
    }
  }, [current]);

  const loadPreview = useCallback(
    async (displayId: string) => {
      setPreviewLoading(true);
      try {
        const response = await Signage.previewDisplay(displayId, cinemaId);
        setPreview(response.data.data);
      } catch {
        setPreview(null);
      } finally {
        setPreviewLoading(false);
      }
    },
    [cinemaId]
  );

  useEffect(() => {
    if (current?.display_id) loadPreview(current.display_id);
  }, [current?.display_id, loadPreview]);

  const saveControls = async (changes: DisplayControls) => {
    if (!current) return;
    setControls((c) => ({ ...c, ...changes }));
    try {
      await run(() => Signage.updateControls(current.display_id, changes, cinemaId), [loadDisplays]);
      loadPreview(current.display_id);
    } catch {
      // Put the controls back to what the API has.
      setControls({
        is_powered_on: current.is_powered_on,
        is_paused: current.is_paused,
        volume: current.volume,
        brightness: current.brightness,
      });
    }
  };

  const regenerateKey = async (display: any) => {
    const result = await run(() => Signage.regenerateKey(display.display_id, cinemaId));
    if (result?.display_key) onNewKey(display, result.display_key);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await run(() => Signage.deleteDisplay(toDelete.display_id, cinemaId), [loadDisplays]);
      if (selectedId === toDelete.display_id) setSelectedId(null);
    } finally {
      setToDelete(null);
    }
  };

  const term = search.trim().toLowerCase();
  const visible = displays.filter(
    (d) =>
      (statusFilter === "all" ||
        (statusFilter === "off" ? !d.is_powered_on : d.status === statusFilter)) &&
      (!term ||
        [d.name, d.location, d.now_playing].some((v) => v?.toLowerCase().includes(term)))
  );

  if (displays.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed rounded-lg">
        <Monitor className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <p className="font-medium">No displays yet</p>
        <p className="text-sm text-muted-foreground">
          Add a display, then enter its key in the screen's player app.
        </p>
      </div>
    );
  }

  const mode = preview?.mode ? PLAYLIST_MODES[preview.mode as keyof typeof PLAYLIST_MODES] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Display list */}
      <div className="border rounded-lg p-4 space-y-3 h-fit">
        <Input.Search
          allowClear
          placeholder="Search displays"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full"
          options={[
            { value: "all", label: "All displays" },
            { value: "online", label: "Online" },
            { value: "offline", label: "Offline" },
            { value: "off", label: "Powered off" },
          ]}
        />
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {visible.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No displays match.</p>
          )}
          {visible.map((display) => (
            <button
              key={display.display_id}
              type="button"
              onClick={() => setSelectedId(display.display_id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                current?.display_id === display.display_id
                  ? "border-[#c77e3b] bg-[#fff8ea]"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-medium truncate">{display.name}</span>
                {display.status === "online" ? (
                  <Tag color="green" icon={<Wifi className="w-3 h-3 inline mr-1" />}>
                    online
                  </Tag>
                ) : (
                  <Tag color="red" icon={<WifiOff className="w-3 h-3 inline mr-1" />}>
                    offline
                  </Tag>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{display.location || "No location set"}</p>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {!display.is_powered_on ? "Powered off" : display.now_playing || "Not polled yet"}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected display */}
      {current && (
        <div className="lg:col-span-2 border rounded-lg p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-sans font-semibold text-lg">{current.name}</h3>
              <p className="text-sm text-muted-foreground">
                {current.location || "No location set"} · {current.resolution} · {current.orientation}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {current.last_seen_at
                  ? `Last seen ${humanDateAndTime(current.last_seen_at)}`
                  : "Has never connected. Enter its key in the player app."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-md"
                icon={<RotateCcw className="w-4 h-4" />}
                title="Refresh"
                onClick={() => {
                  loadDisplays();
                  loadPreview(current.display_id);
                }}
              />
              <Dropdown
                trigger={["click"]}
                menu={{
                  items: [
                    { key: "edit", label: "Edit details", icon: <Edit className="w-4 h-4" />, onClick: () => onEdit(current) },
                    {
                      key: "key",
                      label: "Create new key",
                      icon: <KeyRound className="w-4 h-4" />,
                      onClick: () => regenerateKey(current),
                    },
                    ...(isAdmin
                      ? [
                          {
                            key: "history",
                            label: "Change history",
                            icon: <History className="w-4 h-4" />,
                            onClick: () => setShowHistory(true),
                          },
                        ]
                      : []),
                    { type: "divider" as const },
                    {
                      key: "delete",
                      label: "Delete display",
                      danger: true,
                      icon: <Trash2 className="w-4 h-4" />,
                      onClick: () => setToDelete(current),
                    },
                  ],
                }}
              >
                <Button variant="outline" className="rounded-md" icon={<MoreVertical className="w-4 h-4" />} />
              </Dropdown>
            </div>
          </div>

          {/* What the screen shows now */}
          <div className="rounded-lg bg-gray-950 p-4 text-white min-h-[180px]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <p className="text-sm opacity-80">Showing now</p>
              {mode && <Tag color={mode.color}>{mode.label}</Tag>}
            </div>
            {previewLoading ? (
              <Loader rows={2} />
            ) : !preview ? (
              <p className="text-sm opacity-70">Couldn't load the preview.</p>
            ) : preview.mode === "off" ? (
              <div className="flex flex-col items-center py-8 opacity-70">
                <Power className="w-10 h-10 mb-2" />
                <p className="text-sm">The screen is off.</p>
              </div>
            ) : preview.playlist?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-gray-900">
                {preview.playlist.map((item: any, index: number) => (
                  <PlaylistItem key={`${item.content_id}-${index}`} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-sm opacity-70 py-6 text-center">
                Nothing to show. Add a schedule, pick default content, or turn on auto-schedule.
              </p>
            )}
          </div>

          {/* Controls: the screen applies them on its next poll (within 30 s). */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between border rounded-lg p-3">
              <span className="flex items-center gap-2 text-sm">
                <Power className="w-4 h-4" /> Power
              </span>
              <Switch
                checked={controls.is_powered_on}
                onChange={(checked) => saveControls({ is_powered_on: checked })}
              />
            </div>
            <div className="flex items-center justify-between border rounded-lg p-3">
              <span className="flex items-center gap-2 text-sm">
                {controls.is_paused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {controls.is_paused ? "Paused" : "Playing"}
              </span>
              <Button
                size="xs"
                variant="outline"
                className="rounded-md"
                disabled={!controls.is_powered_on}
                title={controls.is_paused ? "Resume" : "Pause"}
                onClick={() => saveControls({ is_paused: !controls.is_paused })}
              />
            </div>
            <div className="border rounded-lg p-3">
              <span className="flex items-center gap-2 text-sm mb-1">
                <Volume2 className="w-4 h-4" /> Volume {controls.volume ?? 0}%
              </span>
              <Slider
                min={0}
                max={100}
                value={controls.volume}
                onChange={(value) => setControls((c) => ({ ...c, volume: value }))}
                onChangeComplete={(value) => saveControls({ volume: value })}
              />
            </div>
            <div className="border rounded-lg p-3">
              <span className="flex items-center gap-2 text-sm mb-1">
                <Sun className="w-4 h-4" /> Brightness {controls.brightness ?? 0}%
              </span>
              <Slider
                min={0}
                max={100}
                value={controls.brightness}
                onChange={(value) => setControls((c) => ({ ...c, brightness: value }))}
                onChangeComplete={(value) => saveControls({ brightness: value })}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Changes reach the screen on its next check-in, within 30 seconds.
          </p>
        </div>
      )}

      <DisplayModal
        open={showHistory && Boolean(current)}
        title={`Change history: ${current?.name ?? ""}`}
        onClose={() => setShowHistory(false)}
        width={700}
      >
        {showHistory && current && <RecordHistory resourceId={current.display_id} />}
      </DisplayModal>

      <ConfirmationModal
        open={Boolean(toDelete)}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
        content={`Delete ${toDelete?.name}? Its key stops working and the screen goes blank.`}
      />
    </div>
  );
}
