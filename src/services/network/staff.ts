/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Staff = {
  getPosCashiers: (page: number, limit: number) => {
    return Axios.get(`${urls.user}/pos-cashiers?page=${page}&limit=${limit}`);
  },

  getManagers: (page: number, limit: number) => {
    return Axios.get(`${urls.user}/managers?page=${page}&limit=${limit}`);
  },

  getStaffs: (page: number, limit: number) => {
    return Axios.get(`${urls.user}/staffs?page=${page}&limit=${limit}`);
  },

  getCinemaStaff: (page: number, limit: number) => { 
   return Axios.get(`/user-cinema/users?page=${page}&limit=${limit}`);
  },

  assignCinemaStaff: (data: { cinema_id: string; user_id: string }) => {
    return Axios.post(`/user-cinema`, data);
  },

  removeCinemaStaff: (data: { cinema_id: string; user_id: string }) => {
    return Axios.delete(`/user-cinema`, { data });
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
