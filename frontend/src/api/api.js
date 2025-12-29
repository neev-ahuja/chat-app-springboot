import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL,

});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if(error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        if(error.config.url != "/api/login") window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;