// services/auth.js
import { _axios } from "../helpers/axios";

const fetchFaq = async () => {
  return await _axios('get', 'v1/tenant/faq/get-faqs');
};

export { fetchFaq };

