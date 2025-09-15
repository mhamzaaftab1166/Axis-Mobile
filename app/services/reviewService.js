// services/auth.js
import { _axios } from "../helpers/axios";

const submitReview = async (data) => {
  return await _axios('post', 'v1/tenant/ratings/submit-rating', data);
};

export { submitReview };

