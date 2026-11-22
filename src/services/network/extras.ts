import urls from "../../constants/urls";
import Axios from "../httpClient";

export interface AuditFilters {
  action?: string;
  resource?: string;
  search?: string;
  from?: string;
  to?: string;
}

const Extras = {
  /** Newest first; filters are optional. */
  allAuditTrails: (page: number, limit: number, filters: AuditFilters = {}) => {
    return Axios.get(urls.audit, { params: { page, limit, ...filters } });
  },

  /** Resources that have audit records, for the filter dropdown. */
  auditResources: () => {
    return Axios.get(`${urls.audit}/resources`);
  },
};

export default Extras;
