import axiosInstance from "./axiosConfig";
import { ApiError, Result, apiResultWrapper } from "./models";

type RoomResponse = {
    ownerUser: string;
    roomName: string;
}

type AllRoomsResponse = {
    rooms: RoomResponse[]
}

interface IRoomService {
    allRooms: () => Promise<Result<AllRoomsResponse, ApiError>>;
    createRoom: (roomName: string) => Promise<Result<void, ApiError>>;
}

export const roomService: IRoomService = {
    allRooms: async function () {
        return await apiResultWrapper.execute(async function () {
            const response = await axiosInstance.get<AllRoomsResponse>("rooms/all");
            return response.data;
        });
    },
    createRoom: async function (roomName: string): Promise<Result<void, ApiError>> {
        return await apiResultWrapper.execute(async function() {
            await axiosInstance.post<void>(`rooms/create?roomName=${roomName}`);
        })
    }
}