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
import { IconType } from "react-icons";
import { ReactNode } from "react";
import { allRoutes } from "../routes/allRoutes";

interface SidebarProps {
  title: string;
  icon: IconType | ReactNode;
  key: string;
  submenu?: SidebarProps[];
}

const navigationItems = [
  {
    name: "Dashboard",
    icon: BarChart3,
    href: allRoutes.dashboard,
    active: true,
  },
  { name: "Cinema Setup", icon: Settings, href: allRoutes.cinema },
  { name: "Movies", icon: Film, href: "/movies" },
  { name: "Tickets", icon: Ticket, href: "/tickets" },
  { name: "Staff", icon: Users, href: "/staff" },
  { name: "Concessions", icon: ShoppingCart, href: "/concessions" },
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
