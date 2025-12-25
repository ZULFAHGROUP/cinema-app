/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Staff = {
  allStaff: (page: number, limit: number) => {
    return Axios.get(`${urls.staff}?page=${page}&limit=${limit}`);
  },

  createStaff: (data: any) => {
    return Axios.post(urls.staff, data);
  },

  updateStaff: (id: string | number, data: any) => {
    return Axios.patch(`${urls.staff}/${id}`, data);
  },

  deleteStaff: (id: string | number) => {
    return Axios.delete(`${urls.staff}/${id}`);
  },
};

export default Staff;
