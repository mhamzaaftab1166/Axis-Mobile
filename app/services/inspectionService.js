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

// supervisor fetch services
const fetchAssignedServices = async () => {
  return await _axios('get', 'v1/supervisor/service/fetch-inspection-services');
};

const submitQuotation = async (data) => {
  return await _axios('post', 'v1/supervisor/service/quote-inspection-service',data);
};

export { bookInspectionService, fetchAllServices, fetchAssignedServices, fetchMyInspectionService, fetchTopInspectionServices, submitQuotation };

