import axios, { AxiosError } from "axios";
import { ApiError } from "./models";

axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true
});

axiosInstance.interceptors.response.use(null, (error: AxiosError) => {
    const apiError = new ApiError(
        error.response?.status!,
        'Unauthorized',
        // @ts-ignore
        error.response?.data?.errorMessages || ["unknown error"]
    );
    
    return Promise.reject(apiError);
});

export default axiosInstance;