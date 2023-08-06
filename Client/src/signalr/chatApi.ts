import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { 
    JoinRoomRequest,
    JoinRoomResponse,
    LeaveRoomRequest,
    MessageResponse,
    ReceiveAllRoomsResponse,
    SendMessageRequest,
    UsersInRoomResponse
} from "./types";

class ChatApi {
    constructor(private connection: HubConnection) {}

    joinRoom(request: JoinRoomRequest): Promise<JoinRoomResponse> {
        return this.connection.invoke("JoinRoom", request);
    }

    leaveRoom(request: LeaveRoomRequest): void {
        this.connection.invoke("LeaveRoom", request);
    }

    sendMessage(request: SendMessageRequest): void {
        this.connection.invoke("SendMessage", request);
    }

    onReceiveAllRooms(cb: (response: ReceiveAllRoomsResponse) => void): void {
        this.connection.on("receive_all_rooms", cb);
    }

    onReceiveMessage(cb: (response: MessageResponse) => void): void {
        this.connection.on("receive_message", cb);
    }

    onUsersInRoom(cb: (response: UsersInRoomResponse) => void): void {
        this.connection.on("users_in_room", cb);
    }
}

export async function initConnection(): Promise<HubConnection> {
    try {
        const connection = new HubConnectionBuilder()
            .withUrl(`http://localhost:5000/api/chathub`)
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();
        await connection.start();
        return connection;
    } catch (error) {
        console.log("Failed To Initialize ChatHub");
        throw error;
    }
}

const connection = await initConnection();

export default new ChatApi(connection);
