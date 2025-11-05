// services/auth.js
import { _axios } from "../helpers/axios";

const fetchTopInspectionServices = async () => {
  return await _axios('get', 'v1/tenant/inspection-services/fetch-top-inspection-services');
};

const fetchAllServices = async () => {
  return await _axios('get', 'v1/tenant/inspection-services/fetch-inspection-services');
};

const bookInspectionService = async (data) => {
  return await _axios('post', 'v1/tenant/inspection-services/book-inspection',data,"multipart/form-data");
};

const fetchMyInspectionService = async () => {
  return await _axios('get', 'v1/tenant/inspection-services/fetch-inspection-bookings');
};

export { bookInspectionService, fetchAllServices, fetchMyInspectionService, fetchTopInspectionServices };

