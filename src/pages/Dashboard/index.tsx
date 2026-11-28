import {
  Film,
  Users,
  Ticket,
  ShoppingCart,
  BarChart3,
  Settings,
  Gift,
  Monitor,
  Banknote,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/shared/Cards";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useEffect } from "react";
import { getAllMovies } from "../../store/slices/movie";
import { getAllAuditTrails } from "../../store/slices/extras";
import { formatAuditActivity, formatCurrencyToNGN } from "../../utils";
import { getOrderStats } from "../../store/slices/order";
import { allRoutes } from "../../routes/allRoutes";
import { useSalesReport } from "../../hooks/useSalesReport";
import { hasAnyPermission, hasPermission } from "../../utils/permissions";
import sideBarDetails from "../../constants/sidebar";

function Dashboard() {
  const dispatch = useAppDispatch();
  const { limit, page } = useAppSelector((state) => state.movie);
  const { user } = useAppSelector((state) => state.accounts.data);
  const canViewSales = hasAnyPermission(user, [
    "view_sales_reports",
    "view_ticket_sales_reports",
  ]);
  const canViewAllAudit = hasPermission(user, "view_audit_logs");

  useEffect(() => {
    dispatch(getAllMovies({ page, limit })).unwrap();
    dispatch(
      getAllAuditTrails({
        page: 1,
        limit: 5,
        ownOnly: !canViewAllAudit,
      })
    ).unwrap();
    if (canViewSales) {
      dispatch(getOrderStats()).unwrap();
    }
  }, [dispatch, page, limit, canViewAllAudit, canViewSales]);

  const { total: totalMovies } = useAppSelector((state) => state.movie);
  const { auditTrails } = useAppSelector((state) => state.extras);
  const { orderStats } = useAppSelector((state) => state.order);

  const { report } = useSalesReport(undefined, undefined, canViewSales);

  const dashboardStats = [
    ...(canViewSales
      ? [
          {
            title: "Total Revenue",
            value: formatCurrencyToNGN(orderStats?.totalRevenue),
            note: "Completed orders, incl. VAT",
            icon: Banknote,
            badge: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
            dot: "bg-emerald-500",
          },
          {
            title: "Tickets Sold",
            value: (report?.summary.tickets_sold ?? 0).toLocaleString(),
            note: `Avg ${formatCurrencyToNGN(
              report?.summary.average_ticket_price
            )} per ticket`,
            icon: Ticket,
            badge: "bg-[#fff8ea] text-[#c77e3b] border border-[#c77e3b]/25",
            dot: "bg-[#c77e3b]",
          },
          {
            title: "Completed Orders",
            value: Number(orderStats?.completedOrders || 0).toLocaleString(),
            note: `of ${Number(
              orderStats?.totalOrders || 0
            ).toLocaleString()} orders placed`,
            icon: ShoppingCart,
            badge: "bg-amber-50 text-amber-700 border border-amber-200/80",
            dot: "bg-amber-500",
          },
        ]
      : []),
    {
      title: "Active Catalogue",
      value: Number(totalMovies || 0).toLocaleString(),
      note: "Movies in catalogue",
      icon: Film,
      badge: "bg-[#5480c7]/10 text-[#5480c7] border border-[#5480c7]/25",
      dot: "bg-[#5480c7]",
    },
  ];

  const allQuickActions = [
    {
      title: "Cinema Setup",
      description: "Manage theaters, screens & seating maps",
      icon: Settings,
      href: allRoutes.cinema,
    },
    {
      title: "Movie Management",
      description: "Add movies, showtimes & age ratings",
      icon: Film,
      href: allRoutes.movies,
    },
    {
      title: "Ticket Sales",
      description: "Box office POS & seat bookings",
      icon: Ticket,
      href: allRoutes.tickets,
    },
    {
      title: "Staff Management",
      description: "Admin, manager & cashier accounts",
      icon: Users,
      href: allRoutes.staffs,
    },
    {
      title: "Concessions",
      description: "Food, drinks & stock movements",
      icon: ShoppingCart,
      href: allRoutes.concessions,
    },
    {
      title: "Customers",
      description: "Customer accounts & order history",
      icon: Gift,
      href: allRoutes.customers,
    },
    {
      title: "Digital Signage",
      description: "Lobby displays, playlists & schedules",
      icon: Monitor,
      href: allRoutes.signage,
    },
    {
      title: "Reports & Analytics",
      description: "Revenue trends & movie performance",
      icon: BarChart3,
      href: allRoutes.reports,
    },
  ];

  const quickActions = allQuickActions.filter((action) => {
    const navItem = sideBarDetails.find((s) => s.key === action.href);
    return (
      !navItem?.permissions?.length ||
      hasAnyPermission(user, navItem.permissions)
    );
  });

  const recentActivity = auditTrails?.map(formatAuditActivity) || [];
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Habyta-Inspired Solid Architectural Hero Band */}
      <div className="rounded-2xl bg-[#161310] border border-[#2a231c] p-6 md:p-8 text-[#fff8ea]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#fff8ea]/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c77e3b]" />
              <span>{todayFormatted}</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[#fff8ea] tracking-[-0.025em]">
              Welcome back, {user?.surname || "Operations"} {user?.other_names || ""}
            </h1>
            <p className="text-[13px] text-[#fff8ea]/65 max-w-xl leading-relaxed">
              Monitor live box office performance, manage screenings, and keep every auditorium running on schedule.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to={allRoutes.tickets}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c77e3b] hover:bg-[#b06d2f] text-white font-semibold text-[13px] transition-colors"
            >
              <Ticket className="w-4 h-4" />
              New Ticket Sale
            </Link>
            <Link
              to={allRoutes.movies}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[#fff8ea] border border-white/15 font-semibold text-[13px] transition-colors"
            >
              <Film className="w-4 h-4" />
              View Movies
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div
        className={`grid grid-cols-1 ${
          dashboardStats.length > 1 ? "md:grid-cols-4" : "md:grid-cols-2"
        } gap-4`}
      >
        {dashboardStats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl border border-[#e6dfd3] p-5 shadow-[0_1px_2px_rgba(18,22,28,0.05)] hover:border-[#c77e3b]/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#686259]">
                    {stat.title}
                  </p>
                </div>
                <p className="font-display text-[28px] font-bold text-[#12161c] tracking-[-0.03em] leading-none mt-2.5 truncate">
                  {stat.value}
                </p>
                <p className="text-xs text-[#686259] mt-2 font-medium">{stat.note}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.badge}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader className="border-b border-[#e6dfd3]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Operational Modules</CardTitle>
                <CardDescription>
                  Jump directly into core cinema workflows
                </CardDescription>
              </div>
              <span className="eyebrow-chip">Quick Access</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickActions.map((action, idx) => (
                <Link
                  key={action.title}
                  to={action.href}
                  className="group relative p-4 rounded-xl bg-[#faf6ed] hover:bg-white border border-[#e6dfd3] hover:border-[#c77e3b] flex items-start gap-3.5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-[#754f2c] border border-[#e6dfd3] group-hover:bg-[#c77e3b] group-hover:text-white group-hover:border-[#c77e3b] transition-colors flex items-center justify-center shrink-0">
                    <action.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display font-bold text-sm text-[#12161c] group-hover:text-[#c77e3b] transition-colors">
                        {action.title}
                      </p>
                      <span className="text-[11px] font-mono font-semibold text-[#8a8275] group-hover:hidden">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#c77e3b] hidden group-hover:block shrink-0" />
                    </div>
                    <p className="text-xs text-[#686259] mt-0.5 line-clamp-1">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="border-b border-[#e6dfd3]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#c77e3b]" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest operational updates
                </CardDescription>
              </div>
              <Link
                to={allRoutes.audit}
                className="text-xs font-semibold text-[#c77e3b] hover:text-[#754f2c]"
              >
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {recentActivity.length === 0 && (
                <p className="text-sm text-[#686259] text-center py-8">
                  No activity recorded yet.
                </p>
              )}
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#faf6ed] border border-[#e6dfd3] hover:border-[#c77e3b]/40 transition-colors"
                >
                  <div className="w-2 h-2 mt-1.5 bg-[#c77e3b] rounded-full shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#12161c] leading-snug">
                      {activity.action}
                    </p>
                    <p className="text-xs text-[#686259] truncate mt-0.5">
                      {activity.details}
                    </p>
                    <p className="text-[11px] text-[#8a8275] mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
