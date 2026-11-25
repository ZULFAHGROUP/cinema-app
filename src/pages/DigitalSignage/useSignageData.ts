/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Signage from "../../services/network/signage";

/**
 * Everything the signage page shows for one cinema. Lists are small (up to 50 each),
 * so tabs filter them in the browser; `stats` cover the whole cinema.
 */
export const useSignageData = (cinemaId: string | undefined, enabled: boolean) => {
  const [displays, setDisplays] = useState<any[]>([]);
  const [displayStats, setDisplayStats] = useState<any>(null);
  const [contents, setContents] = useState<any[]>([]);
  const [contentStats, setContentStats] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [scheduleStats, setScheduleStats] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDisplays = useCallback(async () => {
    const response = await Signage.displays(cinemaId);
    setDisplays(response.data.data.displays || []);
    setDisplayStats(response.data.data.stats);
  }, [cinemaId]);

  const loadContents = useCallback(async () => {
    const response = await Signage.contents(cinemaId);
    setContents(response.data.data.contents || []);
    setContentStats(response.data.data.stats);
  }, [cinemaId]);

  const loadSchedules = useCallback(async () => {
    const response = await Signage.schedules(cinemaId);
    setSchedules(response.data.data.schedules || []);
    setScheduleStats(response.data.data.stats);
  }, [cinemaId]);

  const loadSettings = useCallback(async () => {
    const response = await Signage.settings(cinemaId);
    setSettings(response.data.data);
  }, [cinemaId]);

  const reloadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadDisplays(), loadContents(), loadSchedules(), loadSettings()]);
    } catch (err: any) {
      setError(err?.message || "Could not load digital signage");
    } finally {
      setLoading(false);
    }
  }, [loadDisplays, loadContents, loadSchedules, loadSettings]);

  useEffect(() => {
    if (enabled) reloadAll();
  }, [enabled, reloadAll]);

  // Displays go offline after 90 s without a poll, so keep their status fresh.
  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(() => loadDisplays().catch(() => undefined), 30_000);
    return () => clearInterval(timer);
  }, [enabled, loadDisplays]);

  /** Runs a change, reloads what it affects, and toasts the API's message. */
  const run = useCallback(
    async (action: () => Promise<any>, reload: Array<() => Promise<void>> = []) => {
      try {
        const response = await action();
        await Promise.all(reload.map((fn) => fn()));
        if (response?.data?.message) toast.success(response.data.message);
        return response?.data?.data;
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
        throw err;
      }
    },
    []
  );

  return {
    displays,
    displayStats,
    contents,
    contentStats,
    schedules,
    scheduleStats,
    settings,
    loading,
    error,
    reloadAll,
    loadDisplays,
    loadContents,
    loadSchedules,
    loadSettings,
    run,
  };
};
