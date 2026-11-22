import urls from "../../constants/urls";
import Axios from "../httpClient";

const Customer = {
  /** `search` matches name, email or phone. */
  getCustomers: (page: number, limit: number, search?: string, is_verified?: boolean) => {
    return Axios.get(urls.customers, {
      params: { page, limit, search: search || undefined, is_verified },
    });
  },

  deleteCustomer: (id: string) => {
    return Axios.delete(`${urls.customers}/${id}`);
  },
};

export default Customer;
