import { CONFIG } from "config/config";

import axiosInstance from "./axios.service";

const basePath = `${CONFIG.PATHS.API_BASE}${CONFIG.PATHS.SNIPPET}`;

export const getCounts = async () => {
  const response = await axiosInstance.get(`${basePath}/counts`);
  return response.data;
};

export const getSnippetsByUser = async (type: string) => {
  const response = await axiosInstance.get(`${basePath}?type=${type}`);
  return response.data;
};

export const toggleFavorite = async (id: string) => {
  const response = await axiosInstance.put(`${basePath}/${id}/favorite`);

  return response.data;
};

export const toggleRemove = async (id: string) => {
  const response = await axiosInstance.put(`${basePath}/${id}/trash`);

  return response.data;
};
