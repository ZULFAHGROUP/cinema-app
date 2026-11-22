/* eslint-disable @typescript-eslint/no-explicit-any */
import urls from "../../constants/urls";
import Axios, { withIdempotencyKey } from "../httpClient";

const Purchase = {
  /** Prices the order, holds the seats and starts the payment. */
  initiate: (data: any, idempotencyKey: string) => {
    return Axios.post(urls.purchase_initiate, data, withIdempotencyKey(idempotencyKey));
  },

  /** Confirms a payment by its reference; safe to call more than once. */
  complete: (reference: string) => {
    return Axios.post(urls.payment_complete, { reference });
  },
};

export default Purchase;
