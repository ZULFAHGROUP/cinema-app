// import * as d3 from "d3-format";
import moment from "moment";
import classNames, { Argument } from "classnames";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Argument[]) {
  return twMerge(classNames(inputs));
}

// Format Currenct Function to NGN
export const formatCurrencyToNGN = (
  amount: number | null | undefined
): string => {
  if (!amount) return "NGN 0.00"; // Handle null, undefined, or zero values

  return `NGN ${new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

// Function to generate a random reference string
export const getReference = (): string => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";
  for (let i = 0; i < 15; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Interface for date object
interface YmdJson {
  year: number;
  month: number;
  day: number;
}

// Convert ISO date to YMD JSON format
export const convertIsoDateToYmdJson = (isoDate: string): YmdJson => {
  const dateMoment = moment(isoDate);

  return {
    year: parseInt(moment(dateMoment).format("YYYY")),
    month: parseInt(moment(dateMoment).format("M")),
    day: parseInt(moment(dateMoment).format("D")),
  };
};

// Convert YMD JSON object back to a date string
export const convertYmdJsonToDate = (date: YmdJson): string => {
  return moment(`${date.year}/${date.month}/${date.day}`, "YYYY/M/D").format(
    "YYYY-MM-DD"
  );
};

export const getHumanDate = (isoFormat: string): string => {
  const readable = new Date(isoFormat);
  const m = readable.getMonth();
  const d = readable.getDate();
  const y = readable.getFullYear();

  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const mLong = months[m];
  return `${mLong} ${d}, ${y}`;
};

export const getDesiredTime = (time: string | number | Date): string => {
  const newDate = new Date(time);
  let hours = newDate.getHours();
  const minutes: string = newDate.getMinutes().toString().padStart(2, "0");
  const ampm: string = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12; // Convert '0' to '12' for 12-hour format

  return `${hours}:${minutes} ${ampm}`;
};

export const currentYear = new Date().getFullYear();

export const humanDateAndTime = (value: string | number | Date): string => {
  const date = new Date(value);

  if (isNaN(date.getTime())) return "Invalid date";

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Time
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12; // 0 becomes 12

  return `${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
};

export const getHumanTime = (time: string): string => {
  if (!time) return "";

  const [hourStr, minuteStr] = time.split(":");
  let hours = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);

  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24h -> 12h
  hours = hours % 12 || 12;

  const mm = String(minutes).padStart(2, "0");

  return `${hours}:${mm} ${ampm}`;
};

export const formatCurrency = (amount: number, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatAuditActivity = (audit: any) => {
  const userName = audit.user
    ? `${audit.user.surname} ${audit.user.other_names}`
    : "System";

  let actionText = "";
  let detailsText = "";

  switch (audit.action) {
    case "CREATE":
      actionText = `${userName} created a ${audit.resource}`;
      break;

    case "UPDATE":
      actionText = `${userName} updated a ${audit.resource}`;
      break;

    case "DELETE":
      actionText = `${userName} deleted a ${audit.resource}`;
      break;

    default:
      actionText = `${userName} performed an action`;
  }

  // Optional: extra friendly detail using metadata
  if (audit.metadata?.body?.name) {
    detailsText = `Name: ${audit.metadata.body.name}`;
  } else if (audit.metadata?.params) {
    detailsText = `Affected ${audit.resource}`;
  } else {
    detailsText = `Action on ${audit.resource}`;
  }

  return {
    action: actionText,
    details: detailsText,
    time: humanDateAndTime(audit.created_at),
  };
};

export const formatUserLabel = (value?: string): string => {
  if (!value) return "";

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};
