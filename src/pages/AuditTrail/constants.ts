/* eslint-disable @typescript-eslint/no-explicit-any */
/** Audit actions the API records, in the order the filter lists them. */
export const AUDIT_ACTIONS = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "LOGIN",
  "LOGIN_FAILED",
  "LOGOUT",
  "SIGNUP",
  "PASSWORD_RESET_REQUEST",
  "PASSWORD_RESET",
  "SWITCH_CINEMA",
];

export const ACTION_COLORS: Record<string, string> = {
  CREATE: "green",
  UPDATE: "blue",
  DELETE: "red",
  LOGIN: "cyan",
  LOGIN_FAILED: "volcano",
  LOGOUT: "default",
  SIGNUP: "purple",
  PASSWORD_RESET_REQUEST: "gold",
  PASSWORD_RESET: "gold",
  SWITCH_CINEMA: "geekblue",
};

const KINDS: Record<string, string> = {
  cinemas: "Cinema",
  screens: "Screen",
  seats: "Seat",
  screen_types: "Screen type",
  movies: "Movie",
  movie_classifications: "Classification",
  showtimes: "Showtime",
  showtime_statuses: "Showtime status",
  products: "Product",
  product_categories: "Product category",
  inventories: "Stock record",
  price_rules: "Price rule",
  vat_config: "VAT config",
  orders: "Order",
  payments: "Payment",
  tickets: "Ticket",
  admins: "Staff member",
  admin_cinemas: "Cinema assignment",
  users: "Customer",
  roles: "Role",
  permissions: "Permission",
  role_permissions: "Role permission",
  admin_roles: "Role assignment",
  signage_displays: "Display",
  signage_contents: "Signage content",
  signage_schedules: "Signage schedule",
  temp_uploads: "Upload",
};

/** "signage_displays" → "Display". */
export const kindOf = (table?: string) => (table && KINDS[table]) || table?.replace(/_/g, " ") || "Record";

const naira = (value: unknown) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(Number(value) || 0);

/**
 * What an audit entry acted on, from its `resource_details` (the record itself):
 * "Cinema" + "Smoke Cinema, Lagos" rather than a bare id. Null when the record is gone.
 */
export const describeResource = (details: any): { kind: string; label: string } | null => {
  if (!details) return null;
  const kind = kindOf(details.table);
  const person = details.surname ? `${details.surname} ${details.other_names ?? ""}`.trim() : "";
  let label =
    details.title ||
    details.name ||
    details.role_name ||
    details.permission_name ||
    person ||
    "";

  if (details.table === "orders") {
    label = `${naira(details.grand_total)} · ${String(details.payment_status || "").replace(/_/g, " ").toLowerCase()}`;
  } else if (details.table === "payments") {
    label = `${naira(details.amount)} · ${String(details.payment_status || "").toLowerCase()}`;
  } else if (details.table === "inventories") {
    label = `${details.quantity} in stock (reorder at ${details.reorder_level})`;
  } else if (details.table === "showtimes") {
    label = `${details.show_date} at ${String(details.show_time || "").slice(0, 5)}`;
  } else if (details.table === "signage_schedules") {
    label = `${String(details.start_time || "").slice(0, 5)} – ${String(details.end_time || "").slice(0, 5)}`;
  } else if (details.table === "price_rules" && details.price != null) {
    label = `${label} · ${naira(details.price)}`;
  } else if (details.table === "cinemas" && details.location) {
    label = `${label}, ${details.location}`;
  }

  if (details.is_deleted) label = `${label || "Record"} (deleted)`;
  return { kind, label: label || "No name" };
};
