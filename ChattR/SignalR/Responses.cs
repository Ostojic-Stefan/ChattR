namespace ChattR.SignalR;

public record JoinRoomResponse(ICollection<MessageResponse> Messages);
public record AllRoomsResponse(ICollection<RoomResponse> Rooms);
public record MessageResponse(string Contents, string SenderUsername);
public record RoomResponse(string Name, string OwnerUsername);
public record ErrorResponse(string Message, int ErrorCode);
public record UsersInRoomResponse(ICollection<User> users);

