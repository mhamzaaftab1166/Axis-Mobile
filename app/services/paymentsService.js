// services/auth.js
import { _axios } from "../helpers/axios";

const fetchPaymentHistory = async () => {
  return await _axios('get', 'v1/tenant/payments/payment-history');
};

export { fetchPaymentHistory };

