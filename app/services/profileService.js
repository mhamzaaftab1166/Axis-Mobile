// services/auth.js
import { _axios } from "../helpers/axios";

const updateProfilePicAndName = async (data) => {
  return await _axios('post', 'v1/profile/update-profile-tenant', data, "multipart/form-data");
};

// update user email - logged in
const updateEmail = async (credentials) => {
  return await _axios('post', 'v1/profile/req-email-change', credentials);
};

// update user email - logged in
const confirmEmailChange = async (data) => {
  return await _axios('post', 'v1/profile/verify-otp-mail-update', data);
};

const updatePassword = async () => {
  return await _axios('get', 'v1/profile/reset-password');
};

// update password
const updateMyPassword = async (data) => {
  return await _axios('post', 'v1/profile/update-my-password',data);
};

export { confirmEmailChange, updateEmail, updateMyPassword, updatePassword, updateProfilePicAndName };

