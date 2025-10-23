/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Roles = {
  allRoles: () => {
    return Axios.get(urls.role);
  },

  createRole: (data: any) => {
    return Axios.post(urls.role, data);
  },

  updateRole: (id: string | number, data: any) => {
    return Axios.patch(`${urls.role}/${id}`, data);
  },

  deleteRole: (id: string | number) => {
    return Axios.delete(`${urls.role}/${id}`);
  },
};

export default Roles;
