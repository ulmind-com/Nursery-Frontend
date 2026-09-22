import axios, { AxiosError } from "axios";
import { tokenStore } from "./token";
import type { ApiError, ApiValidationDetail } from "@/types/api";

export const api = axios.create({
  baseURL: import.meta.env["VITE_API_BASE_URL"] || "https://nursery-backend-c8yw.onrender.com",
  timeout: 45000,
});
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// The API sleeps when idle and takes the better part of a minute to wake, so
// the first call after a quiet spell fails with no response at all. Retry
// those (and only those — a request that got an answer is never repeated, so
// nothing that changes data can run twice).
const RETRY_LIMIT = 2;
api.interceptors.response.use(
  undefined,
  async (error: AxiosError & { config?: { _retry?: number } }) => {
    const config = error.config;
    if (!config || error.response || axios.isCancel(error)) return Promise.reject(error);
    const attempt = (config._retry ?? 0) + 1;
    if (attempt > RETRY_LIMIT) return Promise.reject(error);
    config._retry = attempt;
    await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    return api.request(config);
  },
);

const statusMessages: Record<number, string> = {
  401: "Please sign in to continue.",
  403: "You do not have permission to do that.",
  404: "We couldn't find what you were looking for.",
  422: "Please check the highlighted information.",
  429: "Too many requests. Please wait a moment.",
  500: "The nursery service is having trouble. Please try again.",
};
export function normalizeApiError(error: unknown): ApiError {
  // Keep our own thrown messages intact — they are written for the customer.
  if (!axios.isAxiosError(error))
    return {
      message:
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong. Please try again.",
    };
  const axiosError = error as AxiosError<{
    detail?: string | ApiValidationDetail[];
    message?: string;
  }>;
  if (!axiosError.response)
    return {
      message:
        "We couldn't reach the nursery service. It may be waking up — please try again in a moment.",
    };
  const status = axiosError.response.status;
  const detail = axiosError.response.data?.detail;
  const details = Array.isArray(detail) ? detail : undefined;
  const detailMessage =
    typeof detail === "string"
      ? detail
      : details
          ?.map((item) => item.msg)
          .filter(Boolean)
          .join(" ");
  return {
    status,
    message:
      detailMessage ||
      axiosError.response.data?.message ||
      statusMessages[status] ||
      "Something went wrong. Please try again.",
    ...(details ? { details } : {}),
  };
}
