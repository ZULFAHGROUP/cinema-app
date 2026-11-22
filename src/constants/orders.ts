/** Payment statuses the API uses, with labels and tag colours for tables and filters. */
export const ORDER_STATUSES: Record<string, { label: string; color: string }> = {
  COMPLETED: { label: "Completed", color: "green" },
  PENDING: { label: "Pending", color: "gold" },
  FAILED: { label: "Failed", color: "red" },
  CANCELLED: { label: "Cancelled", color: "default" },
  EXPIRED: { label: "Expired", color: "default" },
  FRAUD_DETECTED: { label: "Fraud detected", color: "red" },
  NEEDS_REFUND: { label: "Needs refund", color: "orange" },
  REFUND_PENDING: { label: "Refund in progress", color: "blue" },
  REFUNDED: { label: "Refunded", color: "purple" },
};

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUSES).map(([value, { label }]) => ({
  value,
  label,
}));
