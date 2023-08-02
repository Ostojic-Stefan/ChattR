import axiosInstance from "./axiosConfig";
import { ApiError, Result, apiResultWrapper } from "./models";

type UserInformationResponse = {
    username: string;
}

type AuthRequest = {
    username: string;
    password: string;
}

interface IAuthService {
    login: (request: AuthRequest) => Promise<Result<void, ApiError>>;
    register: (request: AuthRequest) => Promise<Result<void, ApiError>>;
    me: () => Promise<Result<UserInformationResponse, ApiError>>;
}

export const authService: IAuthService = {
    login: async function (request: AuthRequest) {
        return apiResultWrapper.execute<void>(async function () {
            await axiosInstance.post("auth/login", request)
        });
    },
    me: async function () {
        return apiResultWrapper.execute<UserInformationResponse>(async function() {
            const response = await axiosInstance.get<UserInformationResponse>("auth/me");
            return response.data;
        });
    },
    register: async function (request: AuthRequest) {
        return apiResultWrapper.execute<void>(async function() {
            return await axiosInstance.post("auth/register", request);
        })
    },
}

