import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import { router } from "expo-router";
import { registerIndieID } from "native-notify";
import { ROUTES } from "../helpers/routePaths";
import {
  fetchUserDetails,
  loginUser,
  passwordResetRequest,
  registerUser,
  updatePassword,
  verifyOtp,
} from "../services/authService";
import useAuthStore from "../store/useAuthStore";
import notificationData from "../utils/notificationData";

// fetch user detail
export const useUserDetailQuery = () => {
  const { token, hasHydrated } = useAuthStore();

  const query = useQuery({
    queryKey: ["user-details"],
    queryFn: fetchUserDetails,
    stale: 10 * 10 * 1000,
    enabled: !!token && hasHydrated,
  });

  return {
    userData: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

// register
export const useRegisterQuery = ({
  onSuccessCallback,
  onErrorCallback,
} = {}) => {
  return useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: (response) => {
      if (response?.status === HttpStatusCode.Ok) {
        router.push({
          pathname: ROUTES.OTP,
          params: { email: response?.data },
        });
        onSuccessCallback?.();
      } else {
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
export const useLoginMutation = ({
  onSuccessCallback,
  onErrorCallback,
} = {}) => {
  const { setToken, setRole } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password, rememberMe }) =>
      loginUser({ email, password, rememberMe }),
    onSuccess: (response, variables) => {
      const resData = response;
      if (resData.status === HttpStatusCode.Ok) {
        queryClient.clear();
        setToken(resData?.data?.authToken);
        setRole(resData?.data?.role);
        // register user
        registerIndieID(
          String(resData?.data?.id),
          notificationData.appId,
          notificationData.appToken
        );
        router.replace(ROUTES.HOME);
        onSuccessCallback?.();
      } else {
        if (resData?.status === HttpStatusCode.Forbidden) {
          router.push({
            pathname: ROUTES.OTP,
            params: { email: variables?.email },
          });
          onSuccessCallback?.();
        } else {
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

// reset password
export const useResetPasswordRequest = ({
  onSuccessCallback,
  onErrorCallback,
} = {}) => {
  return useMutation({
    mutationFn: (data) => passwordResetRequest(data),
    onSuccess: (response, variables) => {
      const resData = response;
      if (resData?.status === HttpStatusCode.Ok) {
        router.push({
          pathname: ROUTES.OTP,
          params: { email: variables?.email, resetPassword: true },
        });
        onSuccessCallback?.();
      } else {
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

// verify otp
export const useVerifyOTP = ({ onSuccessCallback, onErrorCallback } = {}) => {
  return useMutation({
    mutationFn: ({ email, otp }) => verifyOtp({ email, otp }),
    onSuccess: (response) => {
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

// update password
export const useUpdatePassword = ({
  onSuccessCallback,
  onErrorCallback,
} = {}) => {
  return useMutation({
    mutationFn: (data) => updatePassword(data),
    onSuccess: (response) => {
      const resData = response;
      if (resData?.status === HttpStatusCode.Ok) {
        onSuccessCallback?.();
      } else {
        onErrorCallback?.(response?.error || "Reset password Failed!");
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
