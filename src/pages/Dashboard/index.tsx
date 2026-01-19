"use client";

import {
  Film,
  Users,
  Ticket,
  ShoppingCart,
  BarChart3,
  Settings,
  Gift,
  Monitor,
  TrendingUp,
  DollarSign,
  Star,
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

function Dashboard() {
  const dispatch = useAppDispatch();
  const { limit, page } = useAppSelector((state) => state.movie);
  useEffect(() => {
    dispatch(getAllMovies({ page, limit })).unwrap();
    dispatch(
    getAllAuditTrails({
      page: 1,
      limit: 5,
    })
  ).unwrap();
  dispatch(getOrderStats()).unwrap();
  }, [dispatch, page, limit]);

  const { movies } = useAppSelector((state) => state.movie);
const { auditTrails } = useAppSelector(
  (state) => state.extras
);
const { orderStats } = useAppSelector(
  (state) => state.order
);

  const dashboardStats = [
    {
      title: "Total Revenue",
      value: formatCurrencyToNGN(orderStats?.totalRevenue) || 0,
      change: "+12%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      // title: "Active Movies",
      title: "Movies",
      value: movies.length,
      // value:'24',
      change: "+2",
      icon: Film,
      color: "text-blue-600",
    },
    {
      title: "Tickets Sold",
      value: "1,247",
      change: "+8%",
      icon: Ticket,
      color: "text-purple-600",
    },
    {
      title: "Avg Rating",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  const quickActions = [
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
      title: "Customer Loyalty",
      description: "Points, rewards & members",
      icon: Gift,
      href: allRoutes.customers,
    },
    {
      title: "Digital Signage",
      description: "Display management",
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
                    <p
                      className={`text-sm font-serif flex items-center gap-1 ${stat.color}`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
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
