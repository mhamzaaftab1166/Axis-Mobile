// services/auth.js
import { _axios } from "../helpers/axios";

const updateProfilePicAndName = async (data) => {
  return await _axios('post', 'v1/profile/update-profile-tenant', data, "multipart/form-data");
};

const updateEmail = async (credentials) => {
  return await _axios('post', 'v1/profile/update-email', credentials);
};

const updatePassword = async () => {
  return await _axios('get', 'v1/profile/reset-password');
};

export { updateEmail, updatePassword, updateProfilePicAndName };

