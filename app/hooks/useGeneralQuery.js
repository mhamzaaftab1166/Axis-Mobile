import { useMutation } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import {
  checkIfQuotationPaymentAllowed, checkIfReviewAllowed
} from "../services/generalService";

// check if quotation allowed
export const useCheckQuotationPaymentAllowed = ({ onSuccessCallback, onErrorCallback } = {}) => {
  return useMutation({
    mutationFn: (id) => checkIfQuotationPaymentAllowed(id),
    onSuccess: (response) => {
        console.log(response);
        if (response?.status === HttpStatusCode.Ok) {
          onSuccessCallback?.();
        } else {
          onErrorCallback?.(response?.error || "Service Booking Failed!");
        }
    },
    onError: (error) => {
      console.log(error);
      const msg = error?.response?.data?.error || error?.message || "Something went wrong while booking service!";
      onErrorCallback?.(msg);
    },
  });
};

// check if quotation allowed
export const useCheckIfReviewAllowed = ({ onSuccessCallback, onErrorCallback } = {}) => {
  return useMutation({
    mutationFn: (data) => checkIfReviewAllowed(data),
    onSuccess: (response,variables) => {
      if (response?.status === HttpStatusCode.Ok) {
        onSuccessCallback?.(variables);
      } else {
        onErrorCallback?.(response?.error || "Service Booking Failed!");
      }
    },
    onError: (error) => {
      console.log(error);
      const msg = error?.response?.data?.error || error?.message || "Something went wrong while booking service!";
      onErrorCallback?.(msg);
    },
  });
};

