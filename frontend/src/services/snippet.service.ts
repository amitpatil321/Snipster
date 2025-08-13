import axiosInstance from "./axios.service";

import type z from "zod";

import { CONFIG } from "@/config/config";
import { snippetSchema } from "@/schema/snippet.schema";

const basePath = `${CONFIG.PATHS.API_BASE}${CONFIG.PATHS.SNIPPET}`;

export const getCounts = async () => {
  const response = await axiosInstance.get(`${basePath}/counts`);
  return response.data;
};

export const getSnippetsByUser = async (
  type: string,
  folderId: string | null,
) => {
  const response = await axiosInstance.get(
    `${basePath}?type=${type}${folderId ? `&folderId=${folderId}` : ""}`,
  );
  return response.data;
};

export const toggleFavorite = async (id: string) => {
  const response = await axiosInstance.patch(`${basePath}/${id}/favorite`);

  return response.data;
};

export const toggleRemove = async (id: string) => {
  const response = await axiosInstance.patch(`${basePath}/${id}/trash`);

  return response.data;
};

export const getSnippetDetails = async (id: string | undefined) => {
  const response = await axiosInstance.get(`${basePath}/details/${id}`);
  return response.data;
};

export type SnippetPayload = z.infer<typeof snippetSchema>;

export const addSnippet = async (formData: SnippetPayload) => {
  const response = await axiosInstance.post(`${basePath}`, formData);
  return response.data;
};

export const updateSnippet = async (changedFields: SnippetPayload) => {
  const response = await axiosInstance.put(`${basePath}`, changedFields);
  return response.data;
};
