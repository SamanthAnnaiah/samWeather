import axios from "axios";

const DEFAULT_TIMEOUT = 10000;

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: DEFAULT_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const normalizeError = (error) => {
  if (axios.isAxiosError(error)) {
    return {
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Request failed",
      status: error.response?.status || null,
      data: error.response?.data || null,
    };
  }

  return {
    message: error?.message || "Unexpected error occurred",
    status: null,
    data: null,
  };
};

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error)),
);

const request = async (config) => {
  const response = await axiosClient(config);
  return response.data;
};

export const getRequest = (url, config = {}) =>
  request({
    ...config,
    method: "get",
    url,
  });

export const postRequest = (url, data = {}, config = {}) =>
  request({
    ...config,
    method: "post",
    url,
    data,
  });

export const putRequest = (url, data = {}, config = {}) =>
  request({
    ...config,
    method: "put",
    url,
    data,
  });

export const patchRequest = (url, data = {}, config = {}) =>
  request({
    ...config,
    method: "patch",
    url,
    data,
  });

export const deleteRequest = (url, config = {}) =>
  request({
    ...config,
    method: "delete",
    url,
  });

export { normalizeError };
export default axiosClient;
