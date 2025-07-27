import { CONFIG } from "config/config";

import axiosInstance from "./axios.service";

export const getSnippetsByUser = async (type: string) => {
  const response = await axiosInstance.get(
    `${CONFIG.PATHS.API_BASE}${CONFIG.PATHS.SNIPPET}?type=${type}`,
  );
  return response.data;
};

export const makeFavorite = async (id: string, favorite: boolean) => {
  const response = await axiosInstance.put(
    `${CONFIG.PATHS.API_BASE}${CONFIG.PATHS.SNIPPET}/${id}/favorite`,
    { isFavorite: favorite },
  );

  return response.data;
};
