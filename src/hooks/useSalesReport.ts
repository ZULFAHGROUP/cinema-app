/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Order from "../services/network/order";

export interface SalesReport {
  summary: {
    orders: number;
    revenue: number;
    vat: number;
    tickets_sold: number;
    ticket_revenue: number;
    concessions_sold: number;
    concession_revenue: number;
    average_ticket_price: number;
  };
  daily: { date: string; tickets: number; concessions: number }[];
  movies: { movie_id: string; title: string; tickets_sold: number; revenue: number }[];
}

/** Start of the day `days - 1` days ago, so "7 days" includes today. Undefined = all time. */
export const periodStart = (days?: number) => {
  if (!days) return undefined;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  return start.toISOString();
};

/** Completed-order sales for a range (ISO dates). Refetches when the range changes. */
export const useSalesReport = (from?: string, to?: string) => {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Order.salesReport(from, to)
      .then((response) => !cancelled && setReport(response.data.data))
      .catch((err: any) => !cancelled && setError(err?.message || "Could not load the report"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  return { report, loading, error };
};

const dayKey = (date: Date) => date.toISOString().slice(0, 10);

/** One point per day for short periods (zeros included), per month for long ones. */
export const revenueSeries = (report: SalesReport, days?: number) => {
  const byDay = new Map(report.daily.map((d) => [d.date, d]));

  if (days && days <= 90) {
    const points = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCDate(date.getUTCDate() - (days - 1 - i));
      const day = byDay.get(dayKey(date));
      return {
        label: date.toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
        tickets: day?.tickets || 0,
        concessions: day?.concessions || 0,
      };
    });
    return points;
  }

  const byMonth = new Map<string, { label: string; tickets: number; concessions: number }>();
  for (const day of report.daily) {
    const month = day.date.slice(0, 7);
    const entry = byMonth.get(month) || {
      label: new Date(`${month}-01T00:00:00Z`).toLocaleDateString("en-NG", {
        month: "short",
        year: "numeric",
      }),
      tickets: 0,
      concessions: 0,
    };
    entry.tickets += day.tickets;
    entry.concessions += day.concessions;
    byMonth.set(month, entry);
  }
  return [...byMonth.values()];
};
