// services/auth.js
import { _axios } from "../helpers/axios";

const fetchTopServices = async (addressId) => {
  return await _axios('get', `v1/tenant/services/get-services-home-page/${addressId}`);
};

const fetchAllServices = async (addressId) => {
  return await _axios('get', `v1/tenant/services/get-all-services/${addressId}`);
};

const fetchMyUpcomingSubs = async () => {
  return await _axios('get', 'v1/tenant/services/sub-services');
};

export { fetchAllServices, fetchMyUpcomingSubs, fetchTopServices };

