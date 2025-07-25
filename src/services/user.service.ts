import axiosInstance from "./axios.service";

export const getAuthenticatedUser = () => {
  return axiosInstance.get("/api/user");
};
