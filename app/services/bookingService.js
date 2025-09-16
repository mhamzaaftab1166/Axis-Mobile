// services/auth.js
import { _axios } from "../helpers/axios";

const bookService = async (data) => {
  return await _axios('post', 'v1/tenant/service/book-service',data);
};

const fetchMyService = async () => {
  return await _axios('get', 'v1/tenant/service/fetch-services');
};

const terminateService = async (id) => {
  return await _axios('get', `v1/tenant/service/terminate-service/${id}`);
};

const fetchSubService = async (serviceId) => {
  return await _axios('get', `v1/tenant/service/fetch-sub-services/${serviceId}`);
};

const fetchMyServices = async () => {
  return await _axios('get', `v1/supervisor/service/fetch-services/`);
};

const fetchSupServiceStats = async () => {
  return await _axios('get', `v1/supervisor/service/service-stats/`);
};

const updateSubService = async (data) => {
  return await _axios('post', `v1/supervisor/service/update-sub-service/`,data);
};

export { bookService, fetchMyService, fetchMyServices, fetchSubService, fetchSupServiceStats, terminateService, updateSubService };

