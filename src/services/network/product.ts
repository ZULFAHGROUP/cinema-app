/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Product = {
  allProducts: (page: number, limit: number) => {
    return Axios.get(`${urls.product}?page=${page}&limit=${limit}`);
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
};

export default Product;
