/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios from "../httpClient";

const Purchase = {
  initiate: (data: any) => {
    return Axios.post(urls.purchase_initiate, data);
  },
};

export default Purchase;
