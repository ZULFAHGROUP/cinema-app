/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactApexChart from "react-apexcharts";
import { revenueSeries, SalesReport } from "../../../hooks/useSalesReport";
import { formatCurrency } from "../../../utils";

interface OverviewReportsProps {
  report: SalesReport;
  /** Days in the period (undefined = all time); fills days with no sales. */
  days?: number;
}

export default function OverviewReports({ report, days }: OverviewReportsProps) {
  const points = revenueSeries(report, days);
  const { ticket_revenue, concession_revenue } = report.summary;

  const areaOptions: any = {
    chart: { type: "area", toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: { categories: points.map((p) => p.label), tickAmount: Math.min(points.length, 12) },
    yaxis: { labels: { formatter: (value: number) => formatCurrency(value) } },
    legend: { position: "top" },
    colors: ["#c77e3b", "#4b5563"],
    fill: { type: "gradient", gradient: { opacityFrom: 0.5, opacityTo: 0.1 } },
    noData: { text: "No sales in this period" },
  };

  const donutOptions: any = {
    chart: { type: "donut" },
    labels: ["Tickets", "Concessions"],
    colors: ["#c77e3b", "#4b5563"],
    legend: { position: "bottom" },
    tooltip: { y: { formatter: (value: number) => formatCurrency(value) } },
    noData: { text: "No sales in this period" },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white border border-[#c77e3b]/15 rounded-2xl p-6 shadow-2xs md:col-span-2">
        <h3 className="font-bold text-lg text-stone-900 mb-0.5">Revenue Trend</h3>
        <p className="text-xs text-stone-500 mb-4">
          Tickets and concessions, before VAT
        </p>
        <ReactApexChart
          options={areaOptions}
          series={
            points.length
              ? [
                  { name: "Tickets", data: points.map((p) => p.tickets) },
                  { name: "Concessions", data: points.map((p) => p.concessions) },
                ]
              : []
          }
          type="area"
          height={300}
        />
      </div>

      <div className="bg-white border border-[#c77e3b]/15 rounded-2xl p-6 shadow-2xs">
        <h3 className="font-bold text-lg text-stone-900 mb-0.5">Revenue Split</h3>
        <p className="text-xs text-stone-500 mb-4">
          Share of sales by type
        </p>
        <ReactApexChart
          options={donutOptions}
          series={ticket_revenue || concession_revenue ? [ticket_revenue, concession_revenue] : []}
          type="donut"
          height={300}
        />
      </div>
    </div>
  );
}
