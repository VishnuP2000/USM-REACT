import axios from "axios";
console.log('welcome axiosInstence')
const api = axios.create({
  baseURL: `${import.meta.APIKEY}`,
  withCredentials: true, // ✅ Important for sending cookies (like refresh token)
});
console.log('it is axiosIntercepter ')
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtUser");
  if (token) {
    console.log('if the token is exist in the axiosInstance',token)
    config.headers.Authorization = `Bearer ${token}`;
    console.log('it is request+++ of axiosInstants',token)
  }
  return config;
});

try {
  api.interceptors.response.use( (res) => res, async (err) => {
    console.log('it is response of axiosIntercepter')
    console.log('it is response of middleware',)
     const originalRequest = err.config;// err.config is contain the original request details
     console.log('it is originalRequest',originalRequest)
    if (err.response?.status === 403 && !originalRequest._retry) {
      console.log('err.response.message',err.response.message)
      originalRequest._retry = true;
      console.log('it is middeleware response on axiosIntercepter')

      const res = await axios.post(
        "http://localhost:4000/admin/refresh",
        {},
        { withCredentials: true } //it is help to acces the cookie in middleware
      );

      const newAdminAccessToken = res.data.adminAccessToken; // get new acces token for using refresh token then pass the accessToken in to frontend as response from refresh controller
      localStorage.setItem("jwtUser", newAdminAccessToken);
      console.log('adminAccessToken',res.data.adminAccessToken)

      originalRequest.headers.Authorization = `Bearer ${newAdminAccessToken}`;
      return axios(originalRequest);
    }

    return Promise.reject(err);
  }
);
} catch (error) {
  console.log('it is axiosIntercepter error',error)
}

export default api;
