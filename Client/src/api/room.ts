import axiosInstance from "./axiosConfig";
import { ApiError, Result, apiResultWrapper } from "./models";

export type RoomResponse = {
    name: string;
    ownerUsername: string;
}

type AllRoomsResponse = {
    rooms: ReadonlyArray<RoomResponse>;
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