namespace ChattR.SignalR;

public record JoinRoomRequest(string RoomName);
public record LeaveRoomRequest(string RoomName);
public record SendMessageRequest(string Contents, string RoomName);
