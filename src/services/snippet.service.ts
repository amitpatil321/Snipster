import { CONFIG } from "config/config";

import axiosInstance from "./axios.service";

export const getSnippetsByUser = async (type: string) => {
  const response = await axiosInstance.get(
    `${CONFIG.PATHS.API_BASE}${CONFIG.PATHS.SNIPPET}?type=${type}`,
  );
  return response.data;
};

export const toggleFavorite = async (id: string) => {
  const response = await axiosInstance.put(
    `${CONFIG.PATHS.API_BASE}${CONFIG.PATHS.SNIPPET}/${id}/favorite`,
  );

  return response.data;
};

export const toggleRemove = async (id: string) => {
  const response = await axiosInstance.put(
    `${CONFIG.PATHS.API_BASE}${CONFIG.PATHS.SNIPPET}/${id}/trash`,
  );

  return response.data;
};
