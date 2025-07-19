import axios from "axios";
console.log('welcome axiosInstence')
const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true, // ✅ Important for sending cookies (like refresh token)
});
console.log('it is axiosIntercepter ')
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('it is request+++ of axiosInstants',token)
  }
  return config;
});

try {
  api.interceptors.response.use( (res) => res, async (err) => {
    console.log('it is response of axiosIntercepter')
     const originalRequest = err.config;
     console.log('it is originalRequest',originalRequest)
    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('it is middeleware response on axiosIntercepter')

      const res = await axios.post(
        "http://localhost:4000/refresh",
        {},
        { withCredentials: true }
      );

      const newAccessToken = res.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axios(originalRequest);
    }

    return Promise.reject(err);
  }
);
} catch (error) {
  console.log('it is axiosIntercepter error',error)
}

export default api;
