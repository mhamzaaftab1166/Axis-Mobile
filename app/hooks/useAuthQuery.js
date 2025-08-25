import { useMutation, useQuery } from '@tanstack/react-query'
import { HttpStatusCode } from 'axios'
import { router } from 'expo-router'
import useAuthStore from '../../config.json'
import { ROUTES } from '../helpers/routePaths'
import { fetchUserDetails, loginUser, passwordResetRequest, registerUser, verifyOtp } from '../services/auth'

export const useUserDetailQuery = () => {
  const query = useQuery({
    queryKey: ['user-details'],
    queryFn: fetchUserDetails,
    staleTime: 5 * 60 * 1000,
  })

  return {
    userData: query.data,
    isLoading: query.isLoading,
    isError: query.isError
  }
}

// register
export const useRegisterQuery = () => {
  return useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: (response) => {
      if (response?.status === HttpStatusCode.Ok) {
        router.push(ROUTES.OTP);
      }
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};

export const useLoginMutation = () => {
  const { setToken, setRole } = useAuthStore()

  return useMutation({
    mutationFn: data => loginUser(data),
    onSuccess: response => {
      const resData = response;
      if (resData.status === HttpStatusCode.Ok) {
        setToken(resData?.data?.authToken)
        setRole(resData?.data?.role)
      }
    },
    onError: error => {
      
    }
  })
}

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

export const useVerifyOTP = () => {
  const { setToken } = useAuthStore()

  return useMutation({
    mutationFn: data => verifyOtp(data),
    onSuccess: response => {
      const resData = response
      if (resData.status === HttpStatusCode.Ok) {
        setToken(resData?.data?.authToken)
      }
    },
  })
}
