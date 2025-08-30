import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HttpStatusCode } from 'axios';
import { router } from 'expo-router';
import { ROUTES } from '../helpers/routePaths';
import { confirmEmailChange, updateEmail, updateMyPassword, updateProfilePicAndName } from '../services/profileService';
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
  const qc = useQueryClient();
  return useMutation({
    mutationFn: data => updateEmail(data),
    onSuccess: (response,variables) => {
      console.log(response);
      const resData = response;
      if (resData.status === HttpStatusCode.Ok) {
        onSuccessCallback?.(variables?.newEmail);
        qc.invalidateQueries(["user-details"]);
      } else {
        onErrorCallback?.(resData?.error || "Email Change request failed");
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

// confirm change email
export const useCofirmEmailChange = ({ onSuccessCallback, onErrorCallback } = {}) => {
  return useMutation({
    mutationFn: data => confirmEmailChange(data),
    onSuccess: (response) => {
      if (response.status === HttpStatusCode.Ok) {
        onSuccessCallback?.();
      } else {
        onErrorCallback?.(response?.error || "Login failed");
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

// update email address
export const useUpdateMyPassword = ({ onSuccessCallback, onErrorCallback } = {}) => {
  return useMutation({
    mutationFn: data => updateMyPassword(data),
    onSuccess: response => {
      if (response.status === HttpStatusCode.Ok) {
        onSuccessCallback?.();
      } else {
        onErrorCallback?.(response?.error || "Password Update failed");
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
