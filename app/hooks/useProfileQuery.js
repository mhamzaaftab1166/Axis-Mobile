import { useMutation } from '@tanstack/react-query';
import { HttpStatusCode } from 'axios';
import { router } from 'expo-router';
import { ROUTES } from '../helpers/routePaths';
import { updateProfilePicAndName } from '../services/profileService';
import useAuthStore from '../store/useAuthStore';

// update profile picture / name
export const useUpdateProfilePicture = ({ onSuccessCallback, onErrorCallback } = {}) => {
  return useMutation({
    mutationFn: data => updateProfilePicAndName(data),
    onSuccess: response => {
      const resData = response;
      if (resData.status === HttpStatusCode.Ok) {
        onSuccessCallback?.();
      } else {
        onErrorCallback?.(resData?.error || "Login failed");
      }
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";
      onErrorCallback?.(msg);
    },
  });
};

// update email address
export const useUpdateEmail = ({ onSuccessCallback, onErrorCallback } = {}) => {
  const { setToken, setRole } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password, rememberMe }) =>
      loginUser({ email, password, rememberMe }),
    onSuccess: (response,variables) => {
      const resData = response;
      if (resData.status === HttpStatusCode.Ok) {
        setToken(resData?.data?.authToken);
        setRole(resData?.data?.role);
        router.replace(ROUTES.HOME);
        onSuccessCallback?.();
      } else {
        if(resData?.status === HttpStatusCode.Forbidden){
          router.push({
            pathname: ROUTES.OTP,
            params: { email: variables?.email }, 
          });
          onSuccessCallback?.();
        }else{
          onErrorCallback?.(resData?.error || "Login failed");
        }
      }
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";
      onErrorCallback?.(msg);
    },
  });
};

// update email address
export const useUpdatePassword = ({ onSuccessCallback, onErrorCallback } = {}) => {
  const { setToken, setRole } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password, rememberMe }) =>
      loginUser({ email, password, rememberMe }),
    onSuccess: (response,variables) => {
      const resData = response;
      if (resData.status === HttpStatusCode.Ok) {
        setToken(resData?.data?.authToken);
        setRole(resData?.data?.role);
        router.replace(ROUTES.HOME);
        onSuccessCallback?.();
      } else {
        if(resData?.status === HttpStatusCode.Forbidden){
          router.push({
            pathname: ROUTES.OTP,
            params: { email: variables?.email }, 
          });
          onSuccessCallback?.();
        }else{
          onErrorCallback?.(resData?.error || "Login failed");
        }
      }
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";
      onErrorCallback?.(msg);
    },
  });
};
