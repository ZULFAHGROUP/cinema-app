import urls from "../../constants/urls";
import Axios, { withIdempotencyKey } from "../httpClient";

/** Filters every staff order list accepts; blank values are ignored by the API. */
export interface OrderFilters {
  search?: string;
  status?: string;
  order_type?: string;
  channel?: "online" | "counter";
  from?: string;
  to?: string;
  /** Admin-role staff only. */
  cinema_id?: string;
}

const Order = {
  /** Orders plus `stats` totalled over every order the filters match. */
  allOrders: (page: number, limit: number, filters: OrderFilters = {}) => {
    return Axios.get(urls.order, { params: { page, limit, ...filters } });
  },

  getOrder: (id: string) => {
    return Axios.get(`${urls.order}/${id}`);
  },

  orderStats: () => {
    return Axios.get(`${urls.order}/stats`);
  },

  /** Completed orders in the range (ISO dates); omit both for all time. */
  salesReport: (from?: string, to?: string) => {
    return Axios.get(`${urls.order}/reports`, { params: { from, to } });
  },

  userOrders: (userId: string, page: number, limit: number) => {
    return Axios.get(`${urls.order}/user/${userId}?page=${page}&limit=${limit}`);
  },

  cinemaOrders: (cinemaId: string, page: number, limit: number) => {
    return Axios.get(`${urls.order}/cinema/${cinemaId}?page=${page}&limit=${limit}`);
  },

  /** Paid orders that lost their seats (NEEDS_REFUND), plus refunds in progress. */
  refunds: (page: number, limit: number, filters: OrderFilters = {}) => {
    return Axios.get(`${urls.order}/refunds`, { params: { page, limit, ...filters } });
  },

  /** `manual: true` only records a refund already made in the gateway dashboard or in cash. */
  refundOrder: (
    id: string,
    data: { note?: string; manual?: boolean },
    idempotencyKey: string
  ) => {
    return Axios.post(`${urls.order}/${id}/refund`, data, withIdempotencyKey(idempotencyKey));
  },
};

export default Order;
