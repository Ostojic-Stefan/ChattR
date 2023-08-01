import axios, { AxiosError } from "axios";

axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;

axios.interceptors.response.use(null, (error: AxiosError) => {
    if (error.status === 401) {
        return Promise.reject(error);
    }
    return Promise.reject(error);
});