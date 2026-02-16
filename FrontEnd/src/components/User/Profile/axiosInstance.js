import axios from "axios";
console.log('welcome axiosInstence')
const api = axios.create({
  baseURL: "https://usm-react.onrender.com",
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
     const originalRequest = err.config;// err.config is contain the original request details
     console.log('it is originalRequest',originalRequest)
    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('it is middeleware response on axiosIntercepter')

      const res = await axios.post(
        "https://usm-react.onrender.com/refresh",
        {},
        { withCredentials: true } //it is help to acces the cookie in middleware
      );

      const newAccessToken = res.data.accessToken; // get new acces token for using refresh token then pass the accessToken in to frontend as response from refresh controller
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
