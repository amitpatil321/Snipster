import axiosInstance from "./axios.service";

import { CONFIG } from "@/config/config";

const basePath = `${CONFIG.PATHS.API_BASE}${CONFIG.PATHS.TAG}`;

export const getTags = async () => {
  const response = await axiosInstance.get(`${basePath}`);
  return response.data;
};
