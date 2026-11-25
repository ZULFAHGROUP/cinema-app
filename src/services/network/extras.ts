import urls from "../../constants/urls";
import Axios from "../httpClient";

export interface AuditFilters {
  action?: string;
  resource?: string;
  search?: string;
  /** `success` (below 400) or `failed`. */
  status?: "success" | "failed";
  resource_id?: string;
  admin_id?: string;
  user_id?: string;
  from?: string;
  to?: string;
}

const Extras = {
  /** Newest first; filters are optional. */
  allAuditTrails: (page: number, limit: number, filters: AuditFilters = {}) => {
    return Axios.get(urls.audit, { params: { page, limit, ...filters } });
  },

  /** The signed-in staff member's own activity (works for all roles without view_audit_logs). */
  myAuditTrails: (page: number, limit: number, filters: AuditFilters = {}) => {
    return Axios.get(urls.audit_me, { params: { page, limit, ...filters } });
  },

  /** One audit record with its actor, request details and row changes. */
  auditById: (auditId: string) => {
    return Axios.get(`${urls.audit}/${auditId}`);
  },

  /** Everything that happened to one record (an order, inventory, display...), oldest first. */
  auditTimeline: (resourceId: string, page = 1, limit = 20) => {
    return Axios.get(`${urls.audit}/timeline/${encodeURIComponent(resourceId)}`, { params: { page, limit } });
  },

  /** Resources that have audit records, for the filter dropdown. */
  auditResources: () => {
    return Axios.get(`${urls.audit}/resources`);
  },
};

export default Extras;
