/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Inventory = {
  allInventories: (page: number, limit: number, cinema_id?: string) => {
    const url = cinema_id
      ? `${urls.inventory}?page=${page}&limit=${limit}&cinema_id=${cinema_id}`
      : `${urls.inventory}?page=${page}&limit=${limit}`;
    return Axios.get(url);
  },

  updateInventory: (id: string | number, data: any) => {
    return Axios.patch(`${urls.inventory}/${id}`, data);
  },

  deleteInventory: (id: string | number) => {
    return Axios.delete(`${urls.inventory}/${id}`);
  },

  getInventoryHistory: (id: string | number) => {
    return Axios.get(`${urls.inventory}/${id}/history`);
  },

  stockIn: (id: string | number, data: { quantity: number; reason: string }) => {
    return Axios.post(`${urls.inventory}/${id}/stock-in`, data);
  },

  recordSpoilage: (id: string | number, data: { quantity: number; reason: string }) => {
    return Axios.post(`${urls.inventory}/${id}/spoilage`, data);
  },

  correctInventory: (id: string | number, data: { quantity: number; reason: string }) => {
    return Axios.post(`${urls.inventory}/${id}/correction`, data);
  },

  transferOut: (id: string | number, data: { quantity: number; reason: string; destination_cinema_id: string }) => {
    return Axios.post(`${urls.inventory}/${id}/transfer-out`, data);
  },

  transferIn: (id: string | number, data: { quantity: number; reason: string; source_cinema_id: string }) => {
    return Axios.post(`${urls.inventory}/${id}/transfer-in`, data);
  },
};

export default Inventory;
