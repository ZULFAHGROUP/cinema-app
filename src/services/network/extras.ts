/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Extras = {
  allAuditTrails: (page: number, limit: number) => {
    return Axios.get(`${urls.audit}?page=${page}&limit=${limit}`);
  },
};

export default Extras;
