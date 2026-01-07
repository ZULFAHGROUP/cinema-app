/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const RolePermissions = {
  allRolePermissions: (page: number, limit: number) => {
    return Axios.get(`${urls.role_permission}?page=${page}&limit=${limit}`);
  },

  createRolePermission: (data: any) => {
    return Axios.post(urls.role_permission, data);
  },
};

export default RolePermissions;
