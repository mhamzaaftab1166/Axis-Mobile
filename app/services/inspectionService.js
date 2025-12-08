// services/auth.js
import { _axios } from "../helpers/axios";

const fetchTopInspectionServices = async (addressId) => {
  return await _axios('get', `v1/tenant/inspection-services/fetch-top-inspection-services/${addressId}`);
};

const fetchAllServices = async (addressId) => {
  return await _axios('get', `v1/tenant/inspection-services/fetch-inspection-services/${addressId}`);
};

const bookInspectionService = async (data) => {
  return await _axios('post', 'v1/tenant/inspection-services/book-inspection',data,"multipart/form-data");
};

const fetchMyInspectionService = async () => {
  return await _axios('get', 'v1/tenant/inspection-services/fetch-inspection-bookings');
};

const completeInspectionQuotationPayment = async (data) => {
  return await _axios('post', 'v1/tenant/inspection-services/inspection-quotation-payment',data);
};

const completeInspectionPendingPayment = async (data) => {
  return await _axios('post', 'v1/tenant/inspection-services/inspection-pending-payment',data);
};

// supervisor fetch services
const fetchAssignedServices = async () => {
  return await _axios('get', 'v1/supervisor/service/fetch-inspection-services');
};

const submitQuotation = async (data) => {
  return await _axios('post', 'v1/supervisor/service/quote-inspection-service',data);
};

// terminate service
const terminateService = async (id) => {
  return await _axios('get', `v1/tenant/inspection-services/terminate-inspection-booking/${id}`);
};

// reject service quotation
const rejectQuotation = async (id) => {
  return await _axios('get', `v1/tenant/inspection-services/reject-inspection-quotation/${id}`);
};

export {
  bookInspectionService, completeInspectionPendingPayment, completeInspectionQuotationPayment, fetchAllServices, fetchAssignedServices,
  fetchMyInspectionService, fetchTopInspectionServices, rejectQuotation, submitQuotation, terminateService
};

