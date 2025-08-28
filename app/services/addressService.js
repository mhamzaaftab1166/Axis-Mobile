// services/auth.js
import { _axios } from "../helpers/axios";

const addAddress = async (data) => {
  return await _axios('post', 'v1/tenant/address/add-address', data);
};

const fetchAddress = async () => {
  return await _axios('get', 'v1/tenant/address/fetch-address');
};

const updateAddress = async (id,data) => {
  return await _axios('put', `v1/tenant/address/update-address/${id}`, data);
};

const removeAddress = async (id) => {
  return await _axios('delete', `v1/tenant/address/remove-address/${id}`);
};

const fetchBuildingsInformation = async (id) => {
  return await _axios('get', `v1/tenant/address/get-buildings`);
};

export { addAddress, fetchAddress, fetchBuildingsInformation, removeAddress, updateAddress };

