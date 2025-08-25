import { useMutation, useQuery } from '@tanstack/react-query'
import { HttpStatusCode } from 'axios'
import { router } from 'expo-router'
import { useSnackbar } from 'notistack'
import useAuthStore from 'src/store/authStore'
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
  const { enqueueSnackbar } = useSnackbar()

  return useMutation({
    mutationFn: data => registerUser(data),
    onSuccess: response => {
      const resData = response;
      
      if (resData.status === HttpStatusCode.Ok) {
        enqueueSnackbar('Register successful', { variant: 'success' })
        router.push(ROUTES.OTP_SCREEN);
      } else {
        enqueueSnackbar(resData.error || 'Login failed', {
          variant: 'error'
        })
      }
    },
    onError: error => {
      enqueueSnackbar(error?.message || 'Something went wrong', {
        variant: 'error'
      })
    }
  })
}

export const useLoginMutation = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { setToken, setRole } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: data => loginUser(data),
    onSuccess: response => {
      const resData = response;

      if (resData.status === HttpStatusCode.Ok) {
        enqueueSnackbar('Login successful', { variant: 'success' })
        setToken(resData?.data?.authToken)
        setRole(resData?.data?.role)
        router.replace('/')
      } else {
        enqueueSnackbar(resData.error || 'Login failed', {
          variant: 'error'
        })
      }
    },
    onError: error => {
      enqueueSnackbar(error?.message || 'Something went wrong', {
        variant: 'error'
      })
    }
  })
}

export const useResetPasswordRequest = onSuccessChangeForm => {
  const { enqueueSnackbar } = useSnackbar()
  const { setToken } = useAuthStore()

  return useMutation({
    mutationFn: data => passwordResetRequest(data),
    onSuccess: response => {
      const resData = response

      if (resData.status === HttpStatusCode.Ok) {
        enqueueSnackbar('Password Reset Request is Successfull! Please check your email for OTP.', {
          variant: 'success'
        })
        setToken(resData?.data?.authToken)
        onSuccessChangeForm?.()
      } else {
        enqueueSnackbar(resData.error || 'Password Reset Request failed', {
          variant: 'error'
        })
      }
    },
    onError: error => {
      console.log(error)
      enqueueSnackbar(error?.message || 'Something went wrong', {
        variant: 'error'
      })
    }
  })
}

export const useVerifyOTP = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { setToken } = useAuthStore()

  return useMutation({
    mutationFn: data => verifyOtp(data),
    onSuccess: response => {
      const resData = response
      if (resData.status === HttpStatusCode.Ok) {
        enqueueSnackbar('Password reset is Successfull! Please check your email for new password.', {
          variant: 'success'
        })
        setToken(resData?.data?.authToken)
      } else {
        enqueueSnackbar(resData.error || 'OTP Verification failed', {
          variant: 'error'
        })
      }
    },
    onError: error => {
      enqueueSnackbar(error?.message || 'Something went wrong', {
        variant: 'error'
      })
    }
  })
}
