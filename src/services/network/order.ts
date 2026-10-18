/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios, { withIdempotencyKey } from "../httpClient";

const Order = {
  allOrders: (page: number, limit: number) => {
    return Axios.get(`${urls.order}?page=${page}&limit=${limit}`);
  },

  getOrder: (id: string) => {
    return Axios.get(`${urls.order}/${id}`);
  },

  orderStats: () => {
    return Axios.get(`${urls.order}/stats`);
  },

  userOrders: (userId: string, page: number, limit: number) => {
    return Axios.get(`${urls.order}/user/${userId}?page=${page}&limit=${limit}`);
  },

  cinemaOrders: (cinemaId: string, page: number, limit: number) => {
    return Axios.get(`${urls.order}/cinema/${cinemaId}?page=${page}&limit=${limit}`);
  },

  /** Paid orders that lost their seats (NEEDS_REFUND), plus refunds in progress. */
  refunds: (page: number, limit: number) => {
    return Axios.get(`${urls.order}/refunds?page=${page}&limit=${limit}`);
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
