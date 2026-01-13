/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

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
};

export default Order;
