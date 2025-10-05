/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Tabs, DatePicker } from "antd";
import Button from "../../components/shared/Button";
import ReusableSelect from "../../components/shared/Select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Film,
  Download,
  BarChart3,
  Target,
} from "lucide-react";
import OverviewReports from "./components/OverviewReports";
import SalesReports from "./components/SalesReports";
import MoviesReports from "./components/MoviesReports";

function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [reportPeriod, setReportPeriod] = useState("7days");
  const [selectedDate, setSelectedDate] = useState<any>(null);

  const periodOptions = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "1year", label: "Last Year" },
  ];

  const kpiData = [
    {
      title: "Total Revenue",
      value: "$168,450",
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Tickets Sold",
      value: "6,847",
      change: "+8.3%",
      trend: "up" as const,
      icon: Film,
      color: "text-blue-600",
    },
    {
      title: "Customer Visits",
      value: "4,521",
      change: "+15.2%",
      trend: "up" as const,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Avg Ticket Price",
      value: "$24.60",
      change: "-2.1%",
      trend: "down" as const,
      icon: Target,
      color: "text-orange-600",
    },
  ];

  const handleExport = () => {
    console.log("Exporting report...");
  };

  const tabItems = [
    {
      key: "overview",
      label: (
        <span className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Overview
        </span>
      ),
      children: <OverviewReports />,
    },
    {
      key: "sales",
      label: (
        <span className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Sales
        </span>
      ),
      children: <SalesReports />,
    },
    {
      key: "movies",
      label: (
        <span className="flex items-center gap-2">
          <Film className="w-4 h-4" /> Movies
        </span>
      ),
      children: <MoviesReports />,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-sans font-bold text-foreground">
              Reports & Analytics
            </h1>
            <p className="text-sm text-muted-foreground font-serif">
              Comprehensive business insights and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ReusableSelect
              name="reportPeriod"
              value={reportPeriod}
              onChange={(value) => setReportPeriod(value)}
              options={periodOptions}
              conClassName="w-36"
            />
            <DatePicker
              onChange={(date) => setSelectedDate(date)}
              placeholder="Pick a date"
              className="h-10"
            />
            <Button
              onClick={handleExport}
              className="gap-2 rounded-md"
              icon={<Download className="w-4 h-4" />}
              title="Export"
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <div key={index} className="border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-serif text-sm text-muted-foreground">
                    {kpi.title}
                  </p>
                  <p className="font-sans text-2xl font-bold">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-serif ${
                        kpi.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center flex-col md:flex-row justify-between mb-6">
          <div className="flex-1">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems.map((item) => ({
                key: item.key,
                label: item.label,
              }))}
              className="reports-tabs"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {tabItems.find((item) => item.key === activeTab)?.children}
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
