import axios, { AxiosError } from "axios";
import { tokenStore } from "./token";
import type { ApiError, ApiValidationDetail } from "@/types/api";

export const api = axios.create({ baseURL: import.meta.env["VITE_API_BASE_URL"] || "https://nursery-backend-c8yw.onrender.com", timeout: 25000 });
api.interceptors.request.use((config) => { const token = tokenStore.get(); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });

const statusMessages: Record<number, string> = { 401: "Please sign in to continue.", 403: "You do not have permission to do that.", 404: "We couldn't find what you were looking for.", 422: "Please check the highlighted information.", 429: "Too many requests. Please wait a moment.", 500: "The nursery service is having trouble. Please try again." };
export function normalizeApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) return { message: "Something went wrong. Please try again." };
  const axiosError = error as AxiosError<{ detail?: string | ApiValidationDetail[]; message?: string }>;
  if (!axiosError.response) return { message: "Unable to connect to the nursery service." };
  const status = axiosError.response.status;
  const detail = axiosError.response.data?.detail;
  const details = Array.isArray(detail) ? detail : undefined;
  const detailMessage = typeof detail === "string" ? detail : details?.map((item) => item.msg).filter(Boolean).join(" ");
  return { status, message: detailMessage || axiosError.response.data?.message || statusMessages[status] || "Something went wrong. Please try again.", ...(details ? { details } : {}) };
}
