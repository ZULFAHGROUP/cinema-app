/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart3,
  Settings,
  Film,
  Ticket,
  Users,
  ShoppingCart,
  Gift,
  Calendar,
  Monitor,
  FileText,
} from "lucide-react";
import { allRoutes } from "../routes/allRoutes";

interface SidebarProps {
  title: string;
  icon: any;
  key: string;
  subMenu?: SidebarProps[];
}

const navigationItems = [
  {
    name: "Dashboard",
    icon: BarChart3,
    href: allRoutes.dashboard,
    active: true,
  },
  { name: "Cinema Setup", icon: Settings, href: allRoutes.cinema },
  { name: "Movies", icon: Film, href: allRoutes.movies },
  { name: "Tickets", icon: Ticket, href: "/tickets" },
  { name: "Staff", icon: Users, href: "/staff" },
  { name: "Concessions", icon: ShoppingCart, href: allRoutes.concessions },
  { name: "Customers", icon: Gift, href: "/loyalty" },
  { name: "Scheduling", icon: Calendar, href: "/scheduling" },
  { name: "Digital Signage", icon: Monitor, href: "/signage" },
  { name: "Reports", icon: FileText, href: "/reports" },
];

const sideBarDetails: SidebarProps[] = navigationItems.map((item) => ({
  title: item.name,
  icon: item.icon,
  key: item.href,
}));

export default sideBarDetails;
