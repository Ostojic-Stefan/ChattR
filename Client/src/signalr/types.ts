export interface RoomResponse {
    name: string;
    ownerUsername: string;
}

export interface MessageResponse {
    contents: string;
    senderUsername: string;
}

export interface UserResponse {
    username: string;
}

export interface UsersInRoomResponse {
    users: ReadonlyArray<UserResponse>;
}

export interface JoinRoomRequest {
    roomName: string;
}

export interface LeaveRoomRequest {
    roomName: string;
}

export interface JoinRoomResponse {
    messages: ReadonlyArray<MessageResponse>;
}

export interface SendMessageRequest {
    roomName: string;
    contents: string;
}

export interface ReceiveAllRoomsResponse {
    rooms: ReadonlyArray<RoomResponse>;
}