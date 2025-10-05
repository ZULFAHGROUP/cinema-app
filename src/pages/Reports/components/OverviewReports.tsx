/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function OverviewReports() {
  const [areaChartOptions] = useState<any>({
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    legend: { position: "top" },
    colors: ["#8884d8", "#82ca9d"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
  });

  const [areaSeries] = useState([
    { name: "Tickets", data: [1200, 900, 1100, 1400, 2200, 2800, 2400] },
    { name: "Concessions", data: [800, 600, 750, 900, 1400, 1800, 1500] },
  ]);

  const [pieChartOptions] = useState<any>({
    chart: { type: "donut" },
    labels: ["18-25", "26-35", "36-45", "46-55", "55+"],
    colors: ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"],
    legend: { position: "bottom" },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
    },
  });

  const [pieSeries] = useState([35, 28, 20, 12, 5]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="border rounded-lg p-6">
        <h3 className="font-sans font-semibold text-lg mb-2">
          Daily Revenue Trends
        </h3>
        <p className="text-sm text-muted-foreground font-serif mb-4">
          Revenue breakdown by tickets and concessions
        </p>
        <ReactApexChart
          options={areaChartOptions}
          series={areaSeries}
          type="area"
          height={300}
        />
      </div>

      <div className="border rounded-lg p-6">
        <h3 className="font-sans font-semibold text-lg mb-2">
          Customer Demographics
        </h3>
        <p className="text-sm text-muted-foreground font-serif mb-4">
          Age distribution of customers
        </p>
        <ReactApexChart
          options={pieChartOptions}
          series={pieSeries}
          type="donut"
          height={300}
        />
      </div>
    </div>
  );
}
