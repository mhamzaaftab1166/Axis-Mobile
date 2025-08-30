// services/auth.js
import { _axios } from "../helpers/axios";

const addPaymentMethod = async (data) => {
  return await _axios('post', 'v1/tenant/payment/add-payment-method', data);
};

const removePaymentMethod = async (id) => {
  return await _axios('delete', `v1/tenant/payment/remove-card/${id}`);
};

const getPaymentMethods = async () => {
  return await _axios('get', 'v1/tenant/payment/fetch-payment-methods');
};

export { addPaymentMethod, getPaymentMethods, removePaymentMethod };

