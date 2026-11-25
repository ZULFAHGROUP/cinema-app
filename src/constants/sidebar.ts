/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart3,
  Settings,
  Film,
  Ticket,
  Users,
  ShoppingCart,
  Gift,
  Monitor,
  FileText,
  Settings2,
  File,
} from "lucide-react";
import { allRoutes } from "../routes/allRoutes";

export interface SidebarProps {
  title: string;
  icon: any;
  key: string;
  /** Permissions that grant access to this sidebar item. Empty/undefined = everyone. */
  permissions?: string[];
  subMenu?: SidebarProps[];
}

const navigationItems = [
  {
    name: "Dashboard",
    icon: BarChart3,
    href: allRoutes.dashboard,
    active: true,
  },
  {
    name: "Cinema Setup",
    icon: Settings,
    href: allRoutes.cinema,
    permissions: ["add_cinemas", "edit_cinemas", "configure_screen_layouts"],
  },
  {
    name: "Movies",
    icon: Film,
    href: allRoutes.movies,
  },
  {
    name: "Tickets",
    icon: Ticket,
    href: allRoutes.tickets,
  },
  {
    name: "Staff",
    icon: Users,
    href: allRoutes.staffs,
    permissions: [
      "manage_users",
      "view_admin_users",
      "view_manager_users",
      "view_pos_cashier_users",
      "view_staff_users",
      "view_cinema_users",
    ],
  },
  {
    name: "Concessions",
    icon: ShoppingCart,
    href: allRoutes.concessions,
  },
  {
    name: "Customers",
    icon: Gift,
    href: allRoutes.customers,
    permissions: ["view_customer_users", "manage_users"],
  },
  {
    name: "Digital Signage",
    icon: Monitor,
    href: allRoutes.signage,
    permissions: ["view_signage", "manage_signage"],
  },
  {
    name: "Reports",
    icon: FileText,
    href: allRoutes.reports,
    permissions: ["view_sales_reports", "view_ticket_sales_reports"],
  },
  {
    name: "Settings",
    icon: Settings2,
    href: allRoutes.settings,
    permissions: [
      "setup_movie_classification",
      "setup_screen_type",
      "setup_showtime_status",
      "assign_roles",
      "manage_product_categories",
      "manage_price_rules",
      "view_role_permissions",
      "assign_permissions",
      "manage_vat_config",
    ],
  },
  {
    name: "Audit Trail",
    icon: File,
    href: allRoutes.audit,
  },
];

const sideBarDetails: SidebarProps[] = navigationItems.map((item) => ({
  title: item.name,
  icon: item.icon,
  key: item.href,
  permissions: item.permissions,
}));

export default sideBarDetails;
