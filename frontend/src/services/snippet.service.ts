import axiosInstance from "./axios.service";

import type z from "zod";

import { CONFIG } from "@/config/config";
import { snippetSchema } from "@/schema/snippet.schema";

const basePath = `${CONFIG.PATHS.API_BASE}${CONFIG.PATHS.SNIPPET}`;

export const getCounts = async () => {
  const response = await axiosInstance.get(`${basePath}/counts`);
  return response.data;
};

export const getSnippetsByUser = async (type: string | undefined) => {
  const response = await axiosInstance.get(`${basePath}?type=${type}`);
  return response.data;
};

export const toggleFavorite = async (data: {
  ids: string[];
  status: boolean;
}) => {
  const response = await axiosInstance.patch(`${basePath}/favorite`, data);

  return response.data;
};

export const toggleRemove = async (data: {
  ids: string[];
  status: boolean;
}) => {
  const response = await axiosInstance.patch(`${basePath}/delete`, data);

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

export const moveToFolder = async (data: {
  snippetIds: string[];
  folderId: string;
}) => {
  const response = await axiosInstance.patch(`${basePath}/folder`, data);
  return response.data;
};
