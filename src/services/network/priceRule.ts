/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const PriceRule = {
  allPriceRules: (page: number, limit: number, cinema_id?: string) => {
    const url = cinema_id
      ? `${urls.price_rule}?page=${page}&limit=${limit}&cinema_id=${cinema_id}`
      : `${urls.price_rule}?page=${page}&limit=${limit}`;
    return Axios.get(url);
  },

  createPriceRule: (data: any) => {
    return Axios.post(urls.price_rule, data);
  },

  updatePriceRule: (id: string | number, data: any) => {
    return Axios.patch(`${urls.price_rule}/${id}`, data);
  },

  deletePriceRule: (id: string | number) => {
    return Axios.delete(`${urls.price_rule}/${id}`);
  },
};

export default PriceRule;
