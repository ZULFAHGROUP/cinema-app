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
    plotOptions: { bar: { columnWidth: "55%", borderRadius: 4 } },
    dataLabels: { enabled: false },
    xaxis: { categories: points.map((p) => p.label), tickAmount: Math.min(points.length, 12) },
    yaxis: { labels: { formatter: (value: number) => formatCurrency(value) } },
    legend: { position: "top" },
    colors: ["#c77e3b", "#4b5563"],
    noData: { text: "No sales in this period" },
  };

  const rows = [
    { label: "Orders completed", value: summary.orders.toLocaleString() },
    { label: "Tickets sold", value: summary.tickets_sold.toLocaleString() },
    { label: "Ticket revenue (before VAT)", value: formatCurrency(summary.ticket_revenue) },
    { label: "Concession items sold", value: summary.concessions_sold.toLocaleString() },
    { label: "Concession revenue (before VAT)", value: formatCurrency(summary.concession_revenue) },
    { label: "Average ticket price (before VAT)", value: formatCurrency(summary.average_ticket_price) },
    { label: "VAT collected", value: formatCurrency(summary.vat) },
    { label: "Total collected", value: formatCurrency(summary.revenue) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="border rounded-lg p-6 lg:col-span-2">
        <h3 className="font-sans font-semibold text-lg mb-1">Sales Breakdown</h3>
        <p className="text-sm text-muted-foreground font-serif mb-4">
          Tickets vs concessions revenue
        </p>
        <ReactApexChart
          options={barOptions}
          series={
            points.length
              ? [
                  { name: "Tickets", data: points.map((p) => p.tickets) },
                  { name: "Concessions", data: points.map((p) => p.concessions) },
                ]
              : []
          }
          type="bar"
          height={350}
        />
      </div>
      <div className="border rounded-lg p-6">
        <h3 className="font-sans font-semibold text-lg mb-4">Totals</h3>
        <dl className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-4 text-sm border-b pb-2">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="font-semibold text-right">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
