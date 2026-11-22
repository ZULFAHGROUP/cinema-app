/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios, { withIdempotencyKey } from "../httpClient";

type MovementInput = { quantity: number; reason?: string };

export interface InventoryFilters {
  search?: string;
  product_category_id?: string;
  /** At or below the reorder level. */
  low_stock?: boolean;
}

const Inventory = {
  /** Stock plus `stats` totalled over every row the filters match. */
  allInventories: (page: number, limit: number, cinema_id?: string, filters: InventoryFilters = {}) => {
    return Axios.get(urls.inventory, {
      params: { page, limit, cinema_id: cinema_id || undefined, ...filters },
    });
  },

  deleteInventory: (id: string | number) => {
    return Axios.delete(`${urls.inventory}/${id}`);
  },

  /** The same product's inventory in other cinemas (needs only transfer_inventory). */
  transferDestinations: (id: string | number) => {
    return Axios.get(`${urls.inventory}/${id}/transfer-destinations`);
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
