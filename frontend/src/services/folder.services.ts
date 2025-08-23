import axiosInstance from "./axios.service";

import { CONFIG } from "@/config/config";

const basePath = `${CONFIG.PATHS.API_BASE}${CONFIG.PATHS.FOLDER}`;

export const createFolder = ({ name }: { name: string }) => {
  return axiosInstance.post(`${basePath}`, { name });
};
