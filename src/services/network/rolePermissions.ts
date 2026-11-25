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

  unassignRolePermission: (data: {
    role_id: string;
    permission_id?: string;
    permission_name?: string;
  }) => {
    return Axios.delete(urls.role_permission_unassign, { data });
  },
};

export default RolePermissions;
