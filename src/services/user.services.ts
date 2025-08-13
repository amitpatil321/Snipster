import axiosInstance from "./axios.service";

import { CONFIG } from "@/config/config";

const basePath = `${CONFIG.PATHS.API_BASE}${CONFIG.PATHS.USER}`;

export const getAuthenticatedUser = () => {
  return axiosInstance.get(basePath);
};

export const getFolders = async () => {
  const response = await axiosInstance.get(`${basePath}/folders`);
  return response.data;
};
