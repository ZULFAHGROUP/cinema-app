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
import { formatAuditActivity, formatCurrencyToNGN  } from "../../utils";
import { getOrderStats } from "../../store/slices/order";
import { allRoutes } from "../../routes/allRoutes";
import { useSalesReport } from "../../hooks/useSalesReport";
import { hasAnyPermission, hasPermission } from "../../utils/permissions";
import sideBarDetails from "../../constants/sidebar";

function Dashboard() {
  const dispatch = useAppDispatch();
  const { limit, page } = useAppSelector((state) => state.movie);
  const { user } = useAppSelector((state) => state.accounts.data);
  const canViewSales = hasAnyPermission(user, ["view_sales_reports", "view_ticket_sales_reports"]);
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
            color: "text-green-600",
          },
          {
            title: "Tickets Sold",
            value: (report?.summary.tickets_sold ?? 0).toLocaleString(),
            note: `Avg ${formatCurrencyToNGN(report?.summary.average_ticket_price)} per ticket`,
            icon: Ticket,
            color: "text-purple-600",
          },
          {
            title: "Completed Orders",
            value: Number(orderStats?.completedOrders || 0).toLocaleString(),
            note: `of ${Number(orderStats?.totalOrders || 0).toLocaleString()} orders placed`,
            icon: ShoppingCart,
            color: "text-yellow-600",
          },
        ]
      : []),
    {
      title: "Movies",
      value: Number(totalMovies || 0).toLocaleString(),
      note: "In the catalogue",
      icon: Film,
      color: "text-blue-600",
    },
  ];

  const allQuickActions = [
    {
      title: "Cinema Setup",
      description: "Manage theaters, screens & seating",
      icon: Settings,
      href: allRoutes.cinema,
    },
    {
      title: "Movie Management",
      description: "Add movies, showtimes & ratings",
      icon: Film,
      href: allRoutes.movies,
    },
    {
      title: "Ticket Sales",
      description: "Box office & seat bookings",
      icon: Ticket,
      href: allRoutes.tickets,
    },
    {
      title: "Staff Management",
      description: "Admin & staff accounts",
      icon: Users,
      href: allRoutes.staffs,
    },
    {
      title: "Concessions",
      description: "Food, drinks & inventory",
      icon: ShoppingCart,
      href: allRoutes.concessions,
    },
    {
      title: "Customers",
      description: "Customer accounts (loyalty coming soon)",
      icon: Gift,
      href: allRoutes.customers,
    },
    {
      title: "Digital Signage",
      description: "Lobby screens, content & schedules",
      icon: Monitor,
      href: allRoutes.signage,
    },
    {
      title: "Reports & Analytics",
      description: "Sales & performance data",
      icon: BarChart3,
      href: allRoutes.reports,
    },
  ];

  const quickActions = allQuickActions.filter((action) => {
    const navItem = sideBarDetails.find((s) => s.key === action.href);
    return !navItem?.permissions?.length || hasAnyPermission(user, navItem.permissions);
  });

  const recentActivity =
  auditTrails?.map(formatAuditActivity) || [];


  return (
    <div className="">
      {/* Dashboard content */}
      <main className="p-2 space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat) => (
            <Card key={stat.title} className="hover:scale-110">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-serif text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-nowrap text-lg md:text-2xl font-sans font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs font-serif text-muted-foreground">
                      {stat.note}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Quick Actions</CardTitle>
            <CardDescription className="font-serif">
              Access key management features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <div
                  key={action.title}
                  className="shadow-md bg-white h-auto p-4 flex flex-col items-start gap-2 rounded-md border border-gray-200"
                >
                  <Link to={action.href} className="text-gray-900!">
                    <action.icon className="w-5 h-5 text-secondary " />
                    <div className="text-left">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-xs">{action.description}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Recent Activity</CardTitle>
            <CardDescription className="font-serif">
              Latest updates across your cinema operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No activity recorded yet.
                </p>
              )}
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg bg-gray-100"
                >
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <div className="flex-1">
                    <p className="font-serif font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-sm font-serif text-muted-foreground">
                      {activity.details}
                    </p>
                  </div>
                  <p className="text-xs font-serif text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Dashboard;
