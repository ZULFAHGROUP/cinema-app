/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function SalesReports() {
  const [barChartOptions] = useState<any>({
    chart: {
      type: "bar",
      height: 350,
      stacked: false,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      title: { text: "$ (thousands)" },
    },
    fill: { opacity: 1 },
    legend: { position: "top" },
    colors: ["#8884d8", "#82ca9d"],
  });

  const [barSeries] = useState([
    { name: "Tickets", data: [1200, 900, 1100, 1400, 2200, 2800, 2400] },
    { name: "Concessions", data: [800, 600, 750, 900, 1400, 1800, 1500] },
  ]);

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-sans font-semibold text-lg mb-2">
        Daily Sales Breakdown
      </h3>
      <p className="text-sm text-muted-foreground font-serif mb-4">
        Tickets vs concessions revenue
      </p>
      <ReactApexChart
        options={barChartOptions}
        series={barSeries}
        type="bar"
        height={350}
      />
    </div>
  );
}
