import axios from "axios";

const baseURL = "http://localhost:4000/auth";

//request interceptor to add the auth token header to requests
axios.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      request.headers["x-auth-token"] = accessToken;
    }
    return request;
  },
  (error) => {
    Promise.reject(error);
  }
);

//response interceptor to refresh token on receiving token expired error
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refreshToken");
    if (
      refreshToken &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      return axios
        .post(`${baseURL}/refresh_token`, { refreshToken: refreshToken })
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("accessToken", res.data.accessToken);
            console.log("Access Token Refreshed");
            console.log(res.data);
            return axios(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  }
);

const api = {
  signUp: (body) => {
    return axios.post(`${baseURL}/signup`, body);
  },
  login: (body) => {
    return axios.post(`${baseURL}/login`, body);
  },
  refreshToken: (body) => {
    return axios.post(`${baseURL}/refresh_token`, body);
  },
  logout: (body) => {
    return axios.delete(`${baseURL}/logout`, body);
  },
  getProtected: () => {
    return axios.get(`${baseURL}/protected`);
  },
};

export default api;
