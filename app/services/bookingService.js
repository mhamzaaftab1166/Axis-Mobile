// services/auth.js
import { _axios } from "../helpers/axios";

const bookService = async (data) => {
  return await _axios('post', 'v1/tenant/service/book-service',data);
};

const fetchMyService = async () => {
  return await _axios('get', 'v1/tenant/service/fetch-services');
};

const terminateService = async (id) => {
  return await _axios('get', 'v1/tenant/service/terminate-service');
};

const fetchSubService = async (serviceId) => {
  return await _axios('get', `v1/tenant/service/fetch-sub-services/${serviceId}`);
};


export { bookService, fetchMyService, fetchSubService, terminateService };

