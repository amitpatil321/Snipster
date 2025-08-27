import axiosInstance from "./axios.service";

import { CONFIG } from "@/config/config";

const basePath = `${CONFIG.PATHS.API_BASE}${CONFIG.PATHS.FOLDER}`;

export const createFolder = ({ name }: { name: string }) => {
  return axiosInstance.post(`${basePath}`, { name });
};
export const renameFolder = (data: { id: string; name: string }) => {
  return axiosInstance.patch(`${basePath}/rename/${data.id}`, data);
};

export const deleteFolder = ({ id }: { id: string }) => {
  return axiosInstance.delete(`${basePath}`, { data: { id } });
};
