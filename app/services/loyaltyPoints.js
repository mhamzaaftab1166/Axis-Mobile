// services/auth.js
import { _axios } from "../helpers/axios";

const getLoyaltyPointsHistory = async () => {
  return await _axios('get', 'v1/tenant/loyalty/fetch-points');
};

export { getLoyaltyPointsHistory };

