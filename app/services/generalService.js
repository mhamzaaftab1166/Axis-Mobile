// services/auth.js
import { _axios } from "../helpers/axios";

const checkIfQuotationPaymentAllowed = async (id) => {
  return await _axios('get', `v1/common/check-qt-eligible/${id}`);
};

const checkIfReviewAllowed = async (data) => {
  return await _axios('post', 'v1/common/check-review-eligible',data);
};

export { checkIfQuotationPaymentAllowed, checkIfReviewAllowed };

