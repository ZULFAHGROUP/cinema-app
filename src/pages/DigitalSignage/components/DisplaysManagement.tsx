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
  run: (
    action: () => Promise<any>,
    reload?: Array<() => Promise<void>>
  ) => Promise<any>;
  loadDisplays: () => Promise<void>;
  onEdit: (display: any) => void;
  onNewKey: (display: any, key: string) => void;
}

function PlaylistItem({ item }: { item: any }) {
  const type = CONTENT_TYPES[item.type as keyof typeof CONTENT_TYPES];
  const Icon = type?.icon || Monitor;
  return (
    <div className="border border-stone-700 rounded-xl overflow-hidden bg-stone-900 text-white">
      <div className="aspect-video bg-black flex items-center justify-center">
        {item.media_url && item.media_kind === "video" ? (
          <video
            src={item.media_url}
            className="w-full h-full object-cover"
            muted
          />
        ) : item.media_url ? (
          <img
            src={item.media_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center px-2">
            <Icon className="w-6 h-6 mx-auto mb-1 text-[#c77e3b]" />
            <p className="text-[10px] text-stone-300 line-clamp-2">
              {item.data?.movies
                ? `${item.data.movies.length} movie(s) showing`
                : item.data?.categories
                ? `${item.data.categories.length} menu categor${
                    item.data.categories.length === 1 ? "y" : "ies"
                  }`
                : item.description || item.name}
            </p>
          </div>
        )}
      </div>
      <div className="p-2.5 bg-stone-900">
        <p className="text-xs font-bold text-[#fff8ea] truncate">{item.name}</p>
        <p className="text-[10px] text-stone-400">
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
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const current =
    displays.find((d) => d.display_id === selectedId) || displays[0];

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
      await run(
        () => Signage.updateControls(current.display_id, changes, cinemaId),
        [loadDisplays]
      );
      loadPreview(current.display_id);
    } catch {
      setControls({
        is_powered_on: current.is_powered_on,
        is_paused: current.is_paused,
        volume: current.volume,
        brightness: current.brightness,
      });
    }
  };

  const regenerateKey = async (display: any) => {
    const result = await run(() =>
      Signage.regenerateKey(display.display_id, cinemaId)
    );
    if (result?.display_key) onNewKey(display, result.display_key);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await run(
        () => Signage.deleteDisplay(toDelete.display_id, cinemaId),
        [loadDisplays]
      );
      if (selectedId === toDelete.display_id) setSelectedId(null);
    } finally {
      setToDelete(null);
    }
  };

  const term = search.trim().toLowerCase();
  const visible = displays.filter(
    (d) =>
      (statusFilter === "all" ||
        (statusFilter === "off"
          ? !d.is_powered_on
          : d.status === statusFilter)) &&
      (!term ||
        [d.name, d.location, d.now_playing].some((v) =>
          v?.toLowerCase().includes(term)
        ))
  );

  if (displays.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-dashed border-[#c77e3b]/30 rounded-2xl">
        <Monitor className="w-10 h-10 mx-auto mb-3 text-[#c77e3b]" />
        <p className="font-extrabold text-stone-800">
          No digital signage displays registered yet
        </p>
        <p className="text-xs text-stone-500 mt-1">
          Click <strong>Add Display</strong> above, then enter its pairing key
          in the screen's player app.
        </p>
      </div>
    );
  }

  const mode = preview?.mode
    ? PLAYLIST_MODES[preview.mode as keyof typeof PLAYLIST_MODES]
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Display Directory Sidebar */}
      <div className="bg-white border border-[#c77e3b]/15 rounded-2xl p-4 space-y-3 h-fit shadow-2xs">
        <Input.Search
          allowClear
          placeholder="Search displays..."
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
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-0.5">
          {visible.length === 0 && (
            <p className="text-xs text-stone-500 text-center py-6">
              No displays match your filter.
            </p>
          )}
          {visible.map((display) => {
            const isSelected = current?.display_id === display.display_id;
            return (
              <button
                key={display.display_id}
                type="button"
                onClick={() => setSelectedId(display.display_id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#c77e3b] bg-[#fff8ea] shadow-2xs"
                    : "border-stone-200/80 hover:border-[#c77e3b]/40 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-stone-900 truncate text-sm">
                    {display.name}
                  </span>
                  {display.status === "online" ? (
                    <Tag
                      color="green"
                      icon={<Wifi className="w-3 h-3 inline mr-1" />}
                    >
                      online
                    </Tag>
                  ) : (
                    <Tag
                      color="red"
                      icon={<WifiOff className="w-3 h-3 inline mr-1" />}
                    >
                      offline
                    </Tag>
                  )}
                </div>
                <p className="text-xs text-stone-500 truncate">
                  {display.location || "No location set"}
                </p>
                <p className="text-[11px] font-semibold text-[#754f2c] truncate mt-1">
                  {!display.is_powered_on
                    ? "Powered off"
                    : display.now_playing || "Awaiting player poll"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Display Control Center */}
      {current && (
        <div className="md:col-span-2 bg-white border border-[#c77e3b]/15 rounded-2xl p-6 space-y-5 shadow-2xs">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-extrabold text-xl text-stone-900">
                {current.name}
              </h3>
              <p className="text-xs font-medium text-stone-500 mt-0.5">
                {current.location || "No location set"} ·{" "}
                <span className="font-bold text-[#754f2c]">
                  {current.resolution}
                </span>{" "}
                · <span className="capitalize">{current.orientation}</span>
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                {current.last_seen_at
                  ? `Last heartbeat: ${humanDateAndTime(current.last_seen_at)}`
                  : "Never connected — pair using the display key in the player app."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
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
                    {
                      key: "edit",
                      label: "Edit Display Details",
                      icon: <Edit className="w-4 h-4" />,
                      onClick: () => onEdit(current),
                    },
                    {
                      key: "key",
                      label: "Rotate Pairing Key",
                      icon: <KeyRound className="w-4 h-4" />,
                      onClick: () => regenerateKey(current),
                    },
                    ...(isAdmin
                      ? [
                          {
                            key: "history",
                            label: "Audit History",
                            icon: <History className="w-4 h-4" />,
                            onClick: () => setShowHistory(true),
                          },
                        ]
                      : []),
                    { type: "divider" as const },
                    {
                      key: "delete",
                      label: "Delete Display",
                      danger: true,
                      icon: <Trash2 className="w-4 h-4" />,
                      onClick: () => setToDelete(current),
                    },
                  ],
                }}
              >
                <Button
                  variant="outline"
                  size="xs"
                  icon={<MoreVertical className="w-4 h-4" />}
                />
              </Dropdown>
            </div>
          </div>

          {/* Live Monitor Preview Frame */}
          <div className="rounded-2xl bg-[#161310] p-5 text-white min-h-[200px] border border-[#2a231c]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-wider text-stone-300">
                  Live Screen Playlist Preview
                </p>
              </div>
              {mode && <Tag color={mode.color}>{mode.label}</Tag>}
            </div>
            {previewLoading ? (
              <Loader rows={2} />
            ) : !preview ? (
              <p className="text-xs text-stone-400">
                Couldn't load the live preview.
              </p>
            ) : preview.mode === "off" ? (
              <div className="flex flex-col items-center py-8 text-stone-400">
                <Power className="w-10 h-10 mb-2 text-stone-500" />
                <p className="text-sm font-semibold">Screen is Powered Off</p>
              </div>
            ) : preview.playlist?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {preview.playlist.map((item: any, index: number) => (
                  <PlaylistItem
                    key={`${item.content_id}-${index}`}
                    item={item}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-8 text-center">
                No active playlist items. Add a schedule, set default content,
                or enable auto-schedule.
              </p>
            )}
          </div>

          {/* Hardware Remote Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between border border-stone-200/80 bg-stone-50/70 rounded-xl p-3.5">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                <Power className="w-4 h-4 text-[#c77e3b]" /> Display Power
              </span>
              <Switch
                checked={controls.is_powered_on}
                onChange={(checked) =>
                  saveControls({ is_powered_on: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between border border-stone-200/80 bg-stone-50/70 rounded-xl p-3.5">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                {controls.is_paused ? (
                  <Pause className="w-4 h-4 text-amber-600" />
                ) : (
                  <Play className="w-4 h-4 text-emerald-600" />
                )}
                {controls.is_paused ? "Playback Paused" : "Playback Running"}
              </span>
              <Button
                size="xs"
                variant="outline"
                disabled={!controls.is_powered_on}
                title={controls.is_paused ? "Resume" : "Pause"}
                onClick={() =>
                  saveControls({ is_paused: !controls.is_paused })
                }
              />
            </div>

            <div className="border border-stone-200/80 bg-stone-50/70 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                <span className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#c77e3b]" /> Audio Volume
                </span>
                <span className="text-[#754f2c]">{controls.volume ?? 0}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                value={controls.volume}
                onChange={(value) =>
                  setControls((c) => ({ ...c, volume: value }))
                }
                onChangeComplete={(value) => saveControls({ volume: value })}
              />
            </div>

            <div className="border border-stone-200/80 bg-stone-50/70 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                <span className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#c77e3b]" /> Panel Brightness
                </span>
                <span className="text-[#754f2c]">
                  {controls.brightness ?? 0}%
                </span>
              </div>
              <Slider
                min={0}
                max={100}
                value={controls.brightness}
                onChange={(value) =>
                  setControls((c) => ({ ...c, brightness: value }))
                }
                onChangeComplete={(value) =>
                  saveControls({ brightness: value })
                }
              />
            </div>
          </div>
          <p className="text-[11px] text-stone-400">
            Remote commands sync to the screen on its next heartbeat check-in
            (within 30 seconds).
          </p>
        </div>
      )}

      <DisplayModal
        open={showHistory && Boolean(current)}
        title={`Change History — ${current?.name ?? ""}`}
        onClose={() => setShowHistory(false)}
        width={680}
      >
        {showHistory && current && (
          <RecordHistory resourceId={current.display_id} />
        )}
      </DisplayModal>

      <ConfirmationModal
        open={Boolean(toDelete)}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
        content={`Delete ${toDelete?.name}? Its pairing key will stop working immediately.`}
      />
    </div>
  );
}
