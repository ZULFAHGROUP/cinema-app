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
  Sparkles,
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
            badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
            bar: "bg-emerald-500",
          },
          {
            title: "Tickets Sold",
            value: (report?.summary.tickets_sold ?? 0).toLocaleString(),
            note: `Avg ${formatCurrencyToNGN(
              report?.summary.average_ticket_price
            )} per ticket`,
            icon: Ticket,
            badge: "bg-[#fff8ea] text-[#c77e3b] ring-1 ring-[#c77e3b]/25",
            bar: "bg-[#c77e3b]",
          },
          {
            title: "Completed Orders",
            value: Number(orderStats?.completedOrders || 0).toLocaleString(),
            note: `of ${Number(
              orderStats?.totalOrders || 0
            ).toLocaleString()} orders placed`,
            icon: ShoppingCart,
            badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
            bar: "bg-amber-500",
          },
        ]
      : []),
    {
      title: "Active Catalogue",
      value: Number(totalMovies || 0).toLocaleString(),
      note: "Movies in catalogue",
      icon: Film,
      badge: "bg-[#5480c7]/10 text-[#5480c7] ring-1 ring-[#5480c7]/25",
      bar: "bg-[#5480c7]",
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
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#754f2c] via-[#c77e3b] to-[#5480c7] p-6 sm:p-8 text-white shadow-lg shadow-[#c77e3b]/15">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold text-[#fff8ea]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{todayFormatted}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#fff8ea] tracking-tight">
              Welcome back, {user?.surname || "Operations"} {user?.other_names || ""}
            </h1>
            <p className="text-sm text-[#fff8ea]/85 max-w-xl">
              Monitor live box office performance, manage screenings, and keep every theater running smoothly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={allRoutes.tickets}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#fff8ea] text-[#754f2c] hover:bg-white font-bold text-sm shadow-md transition-all hover:-translate-y-0.5"
            >
              <Ticket className="w-4 h-4 text-[#c77e3b]" />
              New Ticket Sale
            </Link>
            <Link
              to={allRoutes.movies}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-[#fff8ea] border border-white/25 font-semibold text-sm backdrop-blur-sm transition-all"
            >
              <Film className="w-4 h-4" />
              View Movies
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          dashboardStats.length > 1 ? "lg:grid-cols-4" : "lg:grid-cols-2"
        } gap-5`}
      >
        {dashboardStats.map((stat) => (
          <div
            key={stat.title}
            className="relative overflow-hidden bg-white rounded-2xl border border-[#c77e3b]/15 p-5 shadow-[0_4px_20px_-4px_rgba(117,79,44,0.07)] hover:shadow-[0_10px_28px_-6px_rgba(117,79,44,0.14)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className={`absolute top-0 left-0 right-0 h-1 ${stat.bar}`} />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {stat.title}
                </p>
                <p className="text-2xl font-extrabold text-stone-900 mt-1.5 truncate">
                  {stat.value}
                </p>
                <p className="text-xs text-stone-500 mt-1">{stat.note}</p>
              </div>
              <div className={`p-3 rounded-xl shrink-0 ${stat.badge}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>
                  Jump directly into core cinema workflows
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.href}
                  className="group relative p-4 rounded-2xl bg-[#fff8ea]/45 hover:bg-white border border-[#c77e3b]/15 hover:border-[#c77e3b]/45 flex items-start gap-3.5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="p-2.5 rounded-xl bg-white text-[#c77e3b] border border-[#c77e3b]/20 group-hover:bg-[#c77e3b] group-hover:text-white transition-colors shrink-0 shadow-2xs">
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-sm text-stone-900 group-hover:text-[#c77e3b] transition-colors">
                        {action.title}
                      </p>
                      <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#c77e3b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
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
          <CardHeader className="border-b border-stone-100">
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
                className="text-xs font-bold text-[#c77e3b] hover:text-[#754f2c]"
              >
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.length === 0 && (
                <p className="text-sm text-stone-500 text-center py-8">
                  No activity recorded yet.
                </p>
              )}
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#fff8ea]/50 border border-[#c77e3b]/10 hover:border-[#c77e3b]/30 transition-colors"
                >
                  <div className="w-2.5 h-2.5 mt-1.5 bg-[#c77e3b] rounded-full shrink-0 ring-4 ring-[#c77e3b]/15" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-800 leading-snug">
                      {activity.action}
                    </p>
                    <p className="text-xs text-stone-500 truncate mt-0.5">
                      {activity.details}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1">
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
