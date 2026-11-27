import { useMemo, useState } from "react";
import { Tabs } from "antd";
import { BarChart3, DollarSign, Download, Film, Receipt, ShoppingBag, Ticket } from "lucide-react";
import Button from "../../components/shared/Button";
import ReusableSelect from "../../components/shared/Select";
import Loader from "../../components/shared/Loader";
import OverviewReports from "./components/OverviewReports";
import SalesReports from "./components/SalesReports";
import MoviesReports from "./components/MoviesReports";
import { periodStart, SalesReport, useSalesReport } from "../../hooks/useSalesReport";
import { formatCurrency } from "../../utils";

const PERIODS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last 12 months" },
  { value: "all", label: "All time" },
];

/** Downloads the report as a CSV: summary, then daily figures, then movies. */
const exportCsv = (report: SalesReport, periodLabel: string) => {
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const lines = [
    ["Sales report", periodLabel],
    [],
    ["Metric", "Value"],
    ...Object.entries(report.summary).map(([key, value]) => [key.replace(/_/g, " "), value]),
    [],
    ["Date (UTC)", "Ticket revenue", "Concession revenue"],
    ...report.daily.map((d) => [d.date, d.tickets, d.concessions]),
    [],
    ["Movie", "Tickets sold", "Ticket revenue"],
    ...report.movies.map((m) => [m.title, m.tickets_sold, m.revenue]),
  ];
  const csv = lines.map((line) => line.map(escape).join(",")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = `sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("30");

  const days = period === "all" ? undefined : Number(period);
  const from = useMemo(() => periodStart(days), [days]);
  const { report, loading, error } = useSalesReport(from);
  const periodLabel = PERIODS.find((p) => p.value === period)?.label || "";

  const kpis = report
    ? [
        {
          title: "Total Revenue",
          value: formatCurrency(report.summary.revenue),
          note: `incl. ${formatCurrency(report.summary.vat)} VAT`,
          icon: DollarSign,
          color: "text-green-600",
        },
        {
          title: "Tickets Sold",
          value: report.summary.tickets_sold.toLocaleString(),
          note: formatCurrency(report.summary.ticket_revenue),
          icon: Ticket,
          color: "text-blue-600",
        },
        {
          title: "Avg Ticket Price",
          value: formatCurrency(report.summary.average_ticket_price),
          note: "before VAT",
          icon: Film,
          color: "text-purple-600",
        },
        {
          title: "Completed Orders",
          value: report.summary.orders.toLocaleString(),
          note: `${report.summary.concessions_sold.toLocaleString()} concessions sold (${formatCurrency(report.summary.concession_revenue)})`,
          icon: Receipt,
          color: "text-orange-600",
        },
        {
          title: "Concessions Sold",
          value: report.summary.concessions_sold.toLocaleString(),
          note: formatCurrency(report.summary.concession_revenue),
          icon: ShoppingBag,
          color: "text-teal-600",
        },
      ]
    : [];

  const tabItems = report
    ? [
        {
          key: "overview",
          label: (
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Overview
            </span>
          ),
          children: <OverviewReports report={report} days={days} />,
        },
        {
          key: "sales",
          label: (
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Sales
            </span>
          ),
          children: <SalesReports report={report} days={days} />,
        },
        {
          key: "movies",
          label: (
            <span className="flex items-center gap-2">
              <Film className="w-4 h-4" /> Movies
            </span>
          ),
          children: <MoviesReports report={report} />,
        },
      ]
    : [];

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">Reports & Analytics</h1>
            <p className="text-sm text-stone-500 mt-0.5">
              Completed orders only. Refunded, expired and unpaid orders are excluded.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ReusableSelect
            name="period"
            value={period}
            onChange={(value) => setPeriod(value as string)}
            options={PERIODS}
            showSearch={false}
            conClassName="w-44"
          />
          <Button
            onClick={() => report && exportCsv(report, periodLabel)}
            disabled={!report}
            icon={<Download className="w-4 h-4" />}
            title="Export CSV"
          />
        </div>
      </div>

      {loading && !report ? (
        <Loader rows={8} />
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : report ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.title}
                className="relative overflow-hidden bg-white border border-[#c77e3b]/15 rounded-2xl p-5 shadow-[0_4px_16px_-4px_rgba(117,79,44,0.06)]"
              >
                <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c77e3b] to-[#5480c7]" />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 truncate">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-extrabold text-stone-900 mt-1.5 truncate">
                      {kpi.value}
                    </p>
                    <p className="text-xs text-stone-500 mt-1 truncate">{kpi.note}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#fff8ea] border border-[#c77e3b]/20 shrink-0">
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#c77e3b]/15 px-6 pt-2 shadow-2xs">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems.map((item) => ({ key: item.key, label: item.label }))}
            />
          </div>
          <div className={loading ? "opacity-50" : ""}>
            {tabItems.find((item) => item.key === activeTab)?.children}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default ReportsPage;
