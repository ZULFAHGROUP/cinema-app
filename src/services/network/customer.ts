/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Customer = {
  getCustomers: (page: number, limit: number) => {
    return Axios.get(`${urls.user}/customers?page=${page}&limit=${limit}`);
  },
};

export default Customer;
