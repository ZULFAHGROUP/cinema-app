import urls from "../../constants/urls";
import Axios from "../httpClient";

export type SignageContentType = "movie_carousel" | "menu_display" | "promotional" | "information";
export type PlaylistMode = "off" | "emergency" | "scheduled" | "default" | "auto" | "idle";

export interface DisplayInput {
  name?: string;
  location?: string | null;
  resolution?: string;
  orientation?: "landscape" | "portrait";
}

export interface DisplayControls {
  is_powered_on?: boolean;
  is_paused?: boolean;
  volume?: number;
  brightness?: number;
}

export interface ContentInput {
  name?: string;
  type?: SignageContentType;
  description?: string | null;
  duration_seconds?: number;
  /** From POST /upload?type=signage; or send media_url instead. */
  media_temp_upload_id?: string;
  media_url?: string | null;
  media_kind?: "image" | "video";
}

export interface ScheduleInput {
  content_id?: string;
  /** null = every display in the cinema. */
  display_id?: string | null;
  start_time?: string;
  end_time?: string;
  /** 0 = Sunday; null = every day. */
  days_of_week?: number[] | null;
  priority?: number;
  is_active?: boolean;
}

export interface SettingsInput {
  auto_schedule?: boolean;
  default_content_id?: string | null;
}

// Signage is per cinema. Staff use their own; Admin-role staff must name one,
// which the API reads from ?cinema_id= on every route.
const scoped = (cinemaId?: string, params: Record<string, unknown> = {}) => ({
  params: { ...params, cinema_id: cinemaId || undefined },
});

/** Every list returns `{ <key>: [...], pagination, stats }`. */
const LIST_LIMIT = 50;

const Signage = {
  displays: (cinemaId?: string) =>
    Axios.get(`${urls.signage}/displays`, scoped(cinemaId, { limit: LIST_LIMIT })),
  /** The response includes `display_key`, which is never shown again. */
  createDisplay: (data: DisplayInput, cinemaId?: string) =>
    Axios.post(`${urls.signage}/displays`, data, scoped(cinemaId)),
  updateDisplay: (id: string, data: DisplayInput, cinemaId?: string) =>
    Axios.patch(`${urls.signage}/displays/${id}`, data, scoped(cinemaId)),
  /** Applied by the screen on its next poll (within 30 seconds). */
  updateControls: (id: string, data: DisplayControls, cinemaId?: string) =>
    Axios.patch(`${urls.signage}/displays/${id}/controls`, data, scoped(cinemaId)),
  /** Replaces the key; the old one stops working. */
  regenerateKey: (id: string, cinemaId?: string) =>
    Axios.post(`${urls.signage}/displays/${id}/key`, {}, scoped(cinemaId)),
  /** What the screen shows now: `mode`, `now_playing`, `playlist`. */
  previewDisplay: (id: string, cinemaId?: string) =>
    Axios.get(`${urls.signage}/displays/${id}/preview`, scoped(cinemaId)),
  deleteDisplay: (id: string, cinemaId?: string) =>
    Axios.delete(`${urls.signage}/displays/${id}`, scoped(cinemaId)),

  contents: (cinemaId?: string) =>
    Axios.get(`${urls.signage}/contents`, scoped(cinemaId, { limit: LIST_LIMIT })),
  createContent: (data: ContentInput, cinemaId?: string) =>
    Axios.post(`${urls.signage}/contents`, data, scoped(cinemaId)),
  updateContent: (id: string, data: ContentInput, cinemaId?: string) =>
    Axios.patch(`${urls.signage}/contents/${id}`, data, scoped(cinemaId)),
  deleteContent: (id: string, cinemaId?: string) =>
    Axios.delete(`${urls.signage}/contents/${id}`, scoped(cinemaId)),

  schedules: (cinemaId?: string) =>
    Axios.get(`${urls.signage}/schedules`, scoped(cinemaId, { limit: LIST_LIMIT })),
  createSchedule: (data: ScheduleInput, cinemaId?: string) =>
    Axios.post(`${urls.signage}/schedules`, data, scoped(cinemaId)),
  updateSchedule: (id: string, data: ScheduleInput, cinemaId?: string) =>
    Axios.patch(`${urls.signage}/schedules/${id}`, data, scoped(cinemaId)),
  deleteSchedule: (id: string, cinemaId?: string) =>
    Axios.delete(`${urls.signage}/schedules/${id}`, scoped(cinemaId)),

  settings: (cinemaId?: string) => Axios.get(`${urls.signage}/settings`, scoped(cinemaId)),
  updateSettings: (data: SettingsInput, cinemaId?: string) =>
    Axios.patch(`${urls.signage}/settings`, data, scoped(cinemaId)),
  /** Shows this content on every display in the cinema until ended. */
  startEmergency: (contentId: string, cinemaId?: string) =>
    Axios.post(`${urls.signage}/emergency`, { content_id: contentId }, scoped(cinemaId)),
  endEmergency: (cinemaId?: string) => Axios.delete(`${urls.signage}/emergency`, scoped(cinemaId)),

  /** Uploads an image for signage content; send the returned temp_upload_id. */
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return Axios.post(urls.upload, formData, { params: { type: "signage" } });
  },
};

export default Signage;
