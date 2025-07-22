import { CONFIG } from "config/config";

import axiosInstance from "./axios.service";

export const getSnippetsByUser = () => {
  return axiosInstance.get(CONFIG.API_BASE + CONFIG.SNIPPET);
};
