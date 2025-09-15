import { useMutation } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import {
  submitReview
} from "../services/reviewService";

// =====================
// Submit a review
// =====================
export const useSubmitServiceReview = ({ onSuccessCallback, onErrorCallback } = {}) => {
  return useMutation({
    mutationFn: (data) => submitReview(data),
    onSuccess: (response) => {
      if (response?.status === HttpStatusCode.Ok) {
        onSuccessCallback?.();
      } else {
        onErrorCallback?.(response?.error || "Failed to update sub-service status");
      }
    },
    onError: (error) => {
      console.log(error);
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";
      onErrorCallback?.(msg);
    },
  });
};