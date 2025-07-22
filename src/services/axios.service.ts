import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    // const originalRequest = error.config;

    // if (
    //   error.response &&
    //   [401].includes(error.response.status) &&
    //   !originalRequest._retry
    // ) {
    //   originalRequest._retry = true;

    //   try {
    //     const response = await axios.post(
    //       import.meta.env.VITE_API_BASE + "auth/refresh_token",
    //       {},
    //       {
    //         headers: {
    //           Authorization:
    //             "Bearer " + window.localStorage.getItem("refreshToken"),
    //         },
    //       },
    //     );
    //     if (response) {
    //       localStorage.setItem("accessToken", response.data.data.access_token);
    //       localStorage.setItem(
    //         "refreshToken",
    //         response.data.data.refresh_token,
    //       );
    //       originalRequest.headers["Authorization"] =
    //         `Bearer ${response.data.accessToken}`;

    //       return axiosInstance(originalRequest);
    //     }
    //   } catch (error) {
    //     localStorage.removeItem("accessToken");
    //     localStorage.removeItem("refreshToken");
    //     console.log(error);
    //     window.location.href = PAGES.LOGIN;
    //   }
    // }

    return Promise.reject(error);
  },
);

export default axiosInstance;
