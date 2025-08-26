import { useMutation, useQuery } from '@tanstack/react-query';
import { HttpStatusCode } from 'axios';
import { router } from 'expo-router';
import { ROUTES } from '../helpers/routePaths';
import { fetchUserDetails, loginUser, passwordResetRequest, registerUser, verifyOtp } from '../services/authService';
import useAuthStore from '../store/useAuthStore';

// fetch user detail
export const useUserDetailQuery = () => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["user-details"],
    queryFn: fetchUserDetails,
    stale: 5 * 10 * 1000,
    enabled: !!token && hasHydrated,
  });

  return {
    userData: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error
  }
}

// register
export const useRegisterQuery = ({ onSuccessCallback, onErrorCallback } = {}) => {
  return useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: (response) => {
      if (response?.status === HttpStatusCode.Ok) {
        router.push({
          pathname: ROUTES.OTP,
          params: { email: response?.data }, 
        });
        onSuccessCallback?.();
      }else{
        onErrorCallback?.(response?.error || "Registeration Failed!");
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

// login
export const useLoginMutation = ({ onSuccessCallback, onErrorCallback } = {}) => {
  const { setToken, setRole } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password, rememberMe }) =>
      loginUser({ email, password, rememberMe }),
    onSuccess: (response) => {
      const resData = response;
      if (resData.status === HttpStatusCode.Ok) {
        setToken(resData?.data?.authToken);
        setRole(resData?.data?.role);
        router.replace(ROUTES.HOME);
        onSuccessCallback?.(resData);
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

// reset password
export const useResetPasswordRequest = onSuccessChangeForm => {
  const { setToken } = useAuthStore()

  return useMutation({
    mutationFn: data => passwordResetRequest(data),
    onSuccess: response => {
      const resData = response

      if (resData.status === HttpStatusCode.Ok) {
        setToken(resData?.data?.authToken)
        onSuccessChangeForm?.()
      }
    },
    onError: error => {
      console.log(error)
    }
  })
}

// verify otp
export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: ({email, otp}) => verifyOtp({email, otp}),
    onSuccess: response => {
      const resData = response
      if (resData.status === HttpStatusCode.Ok) {
        router.replace(ROUTES.LOGIN);
      }
    },
  })
};
