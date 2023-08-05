using ChattR.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChattR.SignalR;

public class ChatHub : Hub
{
    private readonly DataContext _ctx;
    private readonly ConnectionService _connectionService;
    private readonly ChatHubService _service;

    public ChatHub(DataContext ctx, ConnectionService connectionService, ChatHubService service)
    {
        _ctx = ctx;
        _connectionService = connectionService;
        _service = service;
    }

    [Authorize]
    public async Task JoinRoom(JoinRoomRequest request, CancellationToken cancellationToken)
    {
        var roomMessages = await _ctx.Rooms
            .SelectMany(r => r.Messages)
            .Select(m => new MessageResponse(m.Contents, m.User.Username))
            .ToListAsync(cancellationToken);
        if (roomMessages is null)
        {
            await Clients.Caller.SendRoomNotFound(cancellationToken);
            return;
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, request.RoomName, cancellationToken);

        _connectionService.AddConnectionToRoom(request.RoomName,
            Guid.Parse(Context.User?.FindFirstValue("userId")!));

        var response = new JoinRoomResponse(roomMessages);
        await Clients.Group(request.RoomName).SendAsync("join_room", response, cancellationToken);
        await _service.SendConnectedUsers(request.RoomName, cancellationToken);
    }

    [Authorize]
    public async Task LeaveRoom(LeaveRoomRequest request, CancellationToken cancellationToken)
    {
        var roomExists = _ctx.Rooms.Any(r => r.Name == request.RoomName);
        if (!roomExists)
        {
            await Clients.Caller.SendRoomNotFound(cancellationToken);
            return;
        }
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, request.RoomName, cancellationToken);

        _connectionService.RemoveConnectionFromRoom(request.RoomName,
            Guid.Parse(Context.User?.FindFirstValue("userId")!));
        await _service.SendConnectedUsers(request.RoomName, cancellationToken);
    }

    [Authorize]
    public async Task SendMessage(SendMessageRequest request, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(Context.User?.FindFirstValue("userId")!);
        var room = await _ctx.Rooms.SingleOrDefaultAsync(r => r.Name == request.RoomName, cancellationToken);
        if (room is null)
        {
            await Clients.Caller.SendRoomNotFound(cancellationToken);
            return;
        }
        room.Messages.Add(new Message
        {
            Contents = request.Contents,
            UserId = userId,
        });
        await _ctx.SaveChangesAsync(cancellationToken);
        var senderUsername = await _ctx.Users
            .Where(u => u.Id == userId)
            .Select(u => u.Username)
            .SingleAsync(cancellationToken);
        var response = new MessageResponse(request.Contents, senderUsername);
        await Clients.Group(request.RoomName).SendAsync("send_message", response, cancellationToken);
    }
}
