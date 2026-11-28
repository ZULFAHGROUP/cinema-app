/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactApexChart from "react-apexcharts";
import { revenueSeries, SalesReport } from "../../../hooks/useSalesReport";
import { formatCurrency } from "../../../utils";

interface SalesReportsProps {
  report: SalesReport;
  days?: number;
}

export default function SalesReports({ report, days }: SalesReportsProps) {
  const points = revenueSeries(report, days);
  const { summary } = report;

  const barOptions: any = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { columnWidth: "55%", borderRadius: 6 } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: points.map((p) => p.label),
      tickAmount: Math.min(points.length, 12),
    },
    yaxis: { labels: { formatter: (value: number) => formatCurrency(value) } },
    legend: { position: "top" },
    colors: ["#c77e3b", "#5480c7"],
    noData: { text: "No sales in this period" },
  };

  const rows = [
    { label: "Orders completed", value: summary.orders.toLocaleString() },
    { label: "Tickets sold", value: summary.tickets_sold.toLocaleString() },
    {
      label: "Ticket revenue (before VAT)",
      value: formatCurrency(summary.ticket_revenue),
    },
    {
      label: "Concession items sold",
      value: summary.concessions_sold.toLocaleString(),
    },
    {
      label: "Concession revenue (before VAT)",
      value: formatCurrency(summary.concession_revenue),
    },
    {
      label: "Average ticket price (before VAT)",
      value: formatCurrency(summary.average_ticket_price),
    },
    { label: "VAT collected", value: formatCurrency(summary.vat) },
    {
      label: "Total gross collected",
      value: formatCurrency(summary.revenue),
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white border border-[#c77e3b]/15 rounded-2xl p-6 shadow-2xs md:col-span-2">
        <h3 className="font-extrabold text-lg text-stone-900 mb-0.5">
          Daily Sales Breakdown
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Tickets vs concessions net revenue
        </p>
        <ReactApexChart
          options={barOptions}
          series={
            points.length
              ? [
                  { name: "Tickets", data: points.map((p) => p.tickets) },
                  {
                    name: "Concessions",
                    data: points.map((p) => p.concessions),
                  },
                ]
              : []
          }
          type="bar"
          height={350}
        />
      </div>
      <div className="bg-white border border-[#c77e3b]/15 rounded-2xl p-6 shadow-2xs">
        <h3 className="font-extrabold text-lg text-stone-900 mb-4">
          Financial Summary
        </h3>
        <dl className="space-y-2.5">
          {rows.map((row) => (
            <div
              key={row.label}
              className={`flex justify-between items-center gap-4 text-xs py-2.5 px-3 rounded-xl ${
                row.highlight
                  ? "bg-[#fff8ea] border border-[#c77e3b]/30 font-extrabold text-stone-900"
                  : "border-b border-stone-100 text-stone-600"
              }`}
            >
              <dt>{row.label}</dt>
              <dd className="font-bold text-stone-900 text-right tabular-nums">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
