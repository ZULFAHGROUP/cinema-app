/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Built-in role permissions matching the backend RBAC setup.
 * Used to filter navigation, tabs, and actions in the UI so each role
 * only sees and interacts with what their role and cinema scope allow.
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    "manage_backups",
    "manage_users",
    "delete_inventory",
    "switch_user_context",
    "assign_roles",
    "manage_vat_config",
    "transfer_inventory",
    "stockin_inventory",
    "view_pos_cashier_users",
    "view_staff_users",
    "assign_users_to_cinemas",
    "view_admin_users",
    "view_manager_users",
    "view_user_logs",
    "view_cinema_users",
    "manage_price_rules",
    "view_audit_logs",
    "manage_inventories",
    "add_cinemas",
    "edit_cinemas",
    "delete_cinemas",
    "assign_permissions",
    "view_role_permissions",
    "configure_screen_layouts",
    "add_edit_movies",
    "schedule_showtimes",
    "edit_showtimes",
    "cancel_showtimes",
    "sell_tickets",
    "manage_product_categories",
    "refund_tickets",
    "view_ticket_sales_reports",
    "manage_products",
    "manage_inventory",
    "sell_concessions",
    "manage_loyalty_tiers",
    "view_loyalty_profiles",
    "redeem_points",
    "create_vouchers",
    "redeem_vouchers",
    "view_sales_reports",
    "view_inventory_reports",
    "manage_system_settings",
    "clock_in_out",
    "view_attendance_logs",
    "setup_movie_classification",
    "setup_screen_type",
    "setup_showtime_status",
    "view_customer_users",
    "view_signage",
    "manage_signage",
  ],
  manager: [
    "view_user_logs",
    "edit_cinemas",
    "manage_vat_config",
    "stockin_inventory",
    "add_edit_movies",
    "view_pos_cashier_users",
    "view_staff_users",
    "manage_inventories",
    "configure_screen_layouts",
    "transfer_inventory",
    "schedule_showtimes",
    "manage_price_rules",
    "edit_showtimes",
    "cancel_showtimes",
    "refund_tickets",
    "view_ticket_sales_reports",
    "manage_products",
    "manage_inventory",
    "view_sales_reports",
    "view_inventory_reports",
    "view_attendance_logs",
    "view_customer_users",
    "view_signage",
    "manage_signage",
  ],
  pos_cashier: [
    "sell_tickets",
    "refund_tickets",
    "view_inventory_reports",
    "sell_concessions",
    "redeem_vouchers",
    "edit_showtimes",
    "clock_in_out",
    "view_own_attendance",
  ],
  staff: [
    "sell_tickets",
    "refund_tickets",
    "view_inventory_reports",
    "manage_products",
    "sell_concessions",
    "clock_in_out",
    "view_own_attendance",
  ],
};

export const normalizeRole = (role?: string): string => {
  if (!role) return "";
  const r = role.trim().toLowerCase().replace(/\s+/g, "_");
  if (r === "superadmin") return "admin";
  return r;
};

export const isAdminRole = (user?: any): boolean => {
  return normalizeRole(user?.role) === "admin";
};

export const isManagerRole = (user?: any): boolean => {
  return normalizeRole(user?.role) === "manager";
};

export const getUserPermissions = (user?: any): Set<string> => {
  if (Array.isArray(user?.permissions) && user.permissions.length > 0) {
    return new Set(user.permissions);
  }
  const roleKey = normalizeRole(user?.role);
  return new Set(ROLE_PERMISSIONS[roleKey] || []);
};

export const hasPermission = (user: any, permission: string): boolean => {
  if (isAdminRole(user)) return true;
  return getUserPermissions(user).has(permission);
};

export const hasAnyPermission = (user: any, permissions: string[]): boolean => {
  if (isAdminRole(user)) return true;
  const userPerms = getUserPermissions(user);
  return permissions.some((p) => userPerms.has(p));
};
