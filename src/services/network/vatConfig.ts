/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const VatConfig = {
  allVatConfigs: (page: number, limit: number) => {
    return Axios.get(`${urls.vat_config}?page=${page}&limit=${limit}`);
  },

  createVatConfig: (data: any) => {
    return Axios.post(urls.vat_config, data);
  },

  updateVatConfig: (id: string | number, data: any) => {
    return Axios.patch(`${urls.vat_config}/${id}`, data);
  },

  deleteVatConfig: (id: string | number) => {
    return Axios.delete(`${urls.vat_config}/${id}`);
  },
};

export default VatConfig;
