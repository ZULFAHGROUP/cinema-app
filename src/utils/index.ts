import * as d3 from "d3-format";
import moment from "moment";

// Format currency function
export const formatCurrency = (amount: number = 0): string => {
  const formattedAmount: string = d3.format(",.2f")(amount);
  const splitAmount: string[] = formattedAmount.split(".");
  return parseInt(splitAmount[1]) ? formattedAmount : splitAmount[0];
};

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
