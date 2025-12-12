/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Product = {
  allProducts: (page: number, limit: number, cinema_id?: string) => {
    const url = cinema_id
      ? `${urls.product}?page=${page}&limit=${limit}&cinema_id=${cinema_id}`
      : `${urls.product}?page=${page}&limit=${limit}`;
    return Axios.get(url);
  },

  createProduct: (data: any) => {
    return Axios.post(urls.product, data);
  },

  updateProduct: (id: string | number, data: any) => {
    return Axios.patch(`${urls.product}/${id}`, data);
  },

  deleteProduct: (id: string | number) => {
    return Axios.delete(`${urls.product}/${id}`);
  },

  availableProducts: (cinema_id?: string) => {
    const url = cinema_id
      ? `${urls.product_available}?cinema_id=${cinema_id}`
      : urls.product_available;
    return Axios.get(url);
  },
};

export default Product;
