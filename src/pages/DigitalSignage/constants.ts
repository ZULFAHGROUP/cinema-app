import { Film, Image as ImageIcon, Info, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { PlaylistMode, SignageContentType } from "../../services/network/signage";

export const CONTENT_TYPES: Record<
  SignageContentType,
  { label: string; color: string; icon: LucideIcon; hint: string; live: boolean }
> = {
  movie_carousel: {
    label: "Movie Carousel",
    color: "purple",
    icon: Film,
    hint: "Fills itself with movies showing in the next 24 hours.",
    live: true,
  },
  menu_display: {
    label: "Menu Display",
    color: "orange",
    icon: UtensilsCrossed,
    hint: "Fills itself with available concessions and prices.",
    live: true,
  },
  promotional: {
    label: "Promotional",
    color: "blue",
    icon: ImageIcon,
    hint: "An advert or trailer: needs an image or a video link.",
    live: false,
  },
  information: {
    label: "Information",
    color: "green",
    icon: Info,
    hint: "A notice: text, an image or a video.",
    live: false,
  },
};

export const CONTENT_TYPE_OPTIONS = Object.entries(CONTENT_TYPES).map(([value, { label }]) => ({
  value,
  label,
}));

/** Why a display shows what it shows, in order of precedence. */
export const PLAYLIST_MODES: Record<PlaylistMode, { label: string; color: string }> = {
  off: { label: "Powered off", color: "default" },
  emergency: { label: "Emergency override", color: "red" },
  scheduled: { label: "Scheduled", color: "blue" },
  default: { label: "Default content", color: "gold" },
  auto: { label: "Auto now-showing", color: "purple" },
  idle: { label: "Nothing to show", color: "default" },
};

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "09:00:00" → "09:00". */
export const shortTime = (time?: string | null) => (time ? time.slice(0, 5) : "");

/** "Every day", "Weekdays", or "Mon, Wed". */
export const describeDays = (days?: number[] | null) => {
  if (!days?.length || days.length === 7) return "Every day";
  const sorted = [...days].sort();
  if (sorted.join() === "1,2,3,4,5") return "Weekdays";
  if (sorted.join() === "0,6") return "Weekends";
  return sorted.map((d) => DAYS[d]).join(", ");
};

/** Equal times run all day; an end before the start runs past midnight. */
export const describeWindow = (start?: string, end?: string) => {
  const from = shortTime(start);
  const to = shortTime(end);
  if (from === to) return "All day";
  return to < from ? `${from} – ${to} (next day)` : `${from} – ${to}`;
};
