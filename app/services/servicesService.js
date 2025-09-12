// services/auth.js
import { _axios } from "../helpers/axios";

const fetchTopServices = async () => {
  return await _axios('get', 'v1/tenant/services/get-services-home-page');
};

const fetchAllServices = async () => {
  return await _axios('get', 'v1/tenant/services/get-all-services');
};

const fetchMyUpcomingSubs = async () => {
  return await _axios('get', 'v1/tenant/services/sub-services');
};

export { fetchAllServices, fetchMyUpcomingSubs, fetchTopServices };

