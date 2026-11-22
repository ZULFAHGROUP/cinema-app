/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

export interface StaffFilters {
  search?: string;
  is_active?: boolean;
}

const Staff = {
  getPosCashiers: (page: number, limit: number, filters: StaffFilters = {}) => {
    return Axios.get(`${urls.staff}/pos-cashiers`, { params: { page, limit, ...filters } });
  },

  getManagers: (page: number, limit: number, filters: StaffFilters = {}) => {
    return Axios.get(`${urls.staff}/managers`, { params: { page, limit, ...filters } });
  },

  getStaffs: (page: number, limit: number, filters: StaffFilters = {}) => {
    return Axios.get(`${urls.staff}/staff`, { params: { page, limit, ...filters } });
  },

  getCinemaStaff: (page: number, limit: number) => {
    return Axios.get(`${urls.admin_cinema}?page=${page}&limit=${limit}`);
  },

  assignCinemaStaff: (data: { cinema_id: string; admin_id: string }) => {
    return Axios.post(urls.admin_cinema, data);
  },

  removeCinemaStaff: (data: { cinema_id: string; admin_id: string }) => {
    return Axios.delete(urls.admin_cinema, { data });
  },

  createStaff: (data: any) => {
    return Axios.post(urls.staff, data);
  },

  updateStaff: (id: string | number, data: any) => {
    return Axios.patch(`${urls.staff}/${id}`, data);
  },

  assignRole: (data: { admin_id: string; role_id: string }) => {
    return Axios.post(urls.admin_role, data);
  },

  removeRole: (data: { admin_id: string; role_id: string }) => {
    return Axios.delete(urls.admin_role, { data });
  },

  deleteStaff: (id: string | number) => {
    return Axios.delete(`${urls.staff}/${id}`);
  },
};

export default Staff;
