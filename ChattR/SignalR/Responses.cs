namespace ChattR.SignalR;

public record JoinRoomResponse(ICollection<MessageResponse> Messages);
public record MessageResponse(string Contents, string SenderUsername);
public record RoomResponse(string Name, string OwnerUsername);
public record ErrorResponse(string Message, int ErrorCode);

