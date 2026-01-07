/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Permissions = {
  allPermissions: (page: number, limit: number) => {
    return Axios.get(`${urls.permission}?page=${page}&limit=${limit}`);
  },

  createPermission: (data: any) => {
    return Axios.post(urls.permission, data);
  },

  updatePermission: (id: string | number, data: any) => {
    return Axios.patch(`${urls.permission}/${id}`, data);
  },

  deletePermission: (id: string | number) => {
    return Axios.delete(`${urls.permission}/${id}`);
  },
};

export default Permissions;
