/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios, { withIdempotencyKey } from "../httpClient";

type MovementInput = { quantity: number; reason?: string };

const Inventory = {
  allInventories: (page: number, limit: number, cinema_id?: string) => {
    const url = cinema_id
      ? `${urls.inventory}?page=${page}&limit=${limit}&cinema_id=${cinema_id}`
      : `${urls.inventory}?page=${page}&limit=${limit}`;
    return Axios.get(url);
  },

  deleteInventory: (id: string | number) => {
    return Axios.delete(`${urls.inventory}/${id}`);
  },

  getInventoryHistory: (inventoryId: string | number, cinemaId: any) => {
    return Axios.get(`${urls.inventory}/${inventoryId}/history?cinema_id=${cinemaId}`);
  },

  // Stock changes need an Idempotency-Key: create one when the user opens the
  // form and reuse it on retries, so a retried request isn't applied twice.
  stockIn: (id: string | number, data: MovementInput, idempotencyKey: string) => {
    return Axios.post(`${urls.inventory}/${id}/stock-in`, data, withIdempotencyKey(idempotencyKey));
  },

  recordSpoilage: (id: string | number, data: MovementInput, idempotencyKey: string) => {
    return Axios.post(`${urls.inventory}/${id}/spoilage`, data, withIdempotencyKey(idempotencyKey));
  },

  correctInventory: (id: string | number, data: MovementInput, idempotencyKey: string) => {
    return Axios.post(`${urls.inventory}/${id}/correction`, data, withIdempotencyKey(idempotencyKey));
  },

  /** Moves stock to the same product's inventory in another cinema (both sides at once). */
  transferOut: (
    id: string | number,
    data: MovementInput & { destination_cinema_id: string; destination_inventory_id: string },
    idempotencyKey: string
  ) => {
    return Axios.post(`${urls.inventory}/${id}/transfer-out`, data, withIdempotencyKey(idempotencyKey));
  },
};

export default Inventory;
