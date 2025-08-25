// services/auth.js
import { _axios } from "../../helpers/axios";

const registerUser = async (data) => {
  return await _axios('post', 'v1/auth/register', data);
};

const loginUser = async (credentials) => {
  return await _axios('post', 'v1/auth/login', credentials);
};

const fetchUserDetails = async () => {
  return await _axios('get', 'v1/auth/getuser');
};

const passwordResetRequest = async (data) => {
  return await _axios('post', 'v1/profile/reset-password-request', data);
};

const verifyOtp = async (data) => {
  return await _axios('post', 'v1/profile/verify-otp', data);
};

export { fetchUserDetails, loginUser, passwordResetRequest, registerUser, verifyOtp };

