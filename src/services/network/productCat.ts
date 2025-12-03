/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const ProductCategories = {
  allProductCategories: (page: number, limit: number) => {
    return Axios.get(`${urls.product_cat}?page=${page}&limit=${limit}`);
  },

  createProductCategories: (data: any) => {
    return Axios.post(urls.product_cat, data);
  },

  updateProductCategories: (id: string | number, data: any) => {
    return Axios.patch(`${urls.product_cat}/${id}`, data);
  },

  deleteProductCategories: (id: string | number) => {
    return Axios.delete(`${urls.product_cat}/${id}`);
  },
};

export default ProductCategories;
