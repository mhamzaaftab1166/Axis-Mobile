import { useMutation } from "@tanstack/react-query";
import { cancelPayment, confirm3DSPayment } from "../services/stripeService";

// Delete notification
export const useStripeConfirmPayment = ({
  onSuccessCallback,
  onErrorCallback,
} = {}) => {

  return useMutation({
    mutationFn: ({clientSecret, pmtMethodId, intentId}) => confirm3DSPayment(clientSecret, pmtMethodId,intentId),
    onSuccess: (response) => {
      onSuccessCallback?.(response.intentId ? response.intentId : undefined);
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

export const useStripeCancelledIntent = ({
  onSuccessCallback,
  onErrorCallback,
} = {}) => {

  return useMutation({
    mutationFn: ({intentId}) => cancelPayment(intentId),
    onSuccess: (response) => {
      onSuccessCallback?.();
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
