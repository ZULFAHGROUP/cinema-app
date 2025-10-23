/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Extras = {
  allAuditTrails: () => {
    return Axios.get(urls.audit);
  },
};

export default Extras;
