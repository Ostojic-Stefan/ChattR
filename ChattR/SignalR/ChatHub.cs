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
    private readonly ILogger<ChatHub> _logger;

    public ChatHub(DataContext ctx,
        ConnectionService connectionService,
        ChatHubService service,
        ILogger<ChatHub> logger
    )
    {
        _ctx = ctx;
        _connectionService = connectionService;
        _service = service;
        _logger = logger;
    }

    [Authorize]
    public async Task<JoinRoomResponse> JoinRoom(JoinRoomRequest request)
    {
        var roomMessages = await _ctx.Rooms
            .Where(r => r.Name == request.RoomName)
            .SelectMany(r => r.Messages)
            .Select(m => new MessageResponse(m.Contents, m.User.Username))
            .ToListAsync();
        //if (roomMessages is null)
        //{
        //    await Clients.Caller.SendRoomNotFound();
        //    return;
        //}

        await Groups.AddToGroupAsync(Context.ConnectionId, request.RoomName);

        _connectionService.AddConnectionToRoom(request.RoomName,
            Guid.Parse(Context.User?.FindFirstValue("userId")!));

        var response = new JoinRoomResponse(roomMessages);
        //await Clients.Group(request.RoomName).SendAsync("join_room", response);
        await _service.SendConnectedUsers(request.RoomName);
        return response;
    }

    [Authorize]
    public async Task LeaveRoom(LeaveRoomRequest request)
    {
        var roomExists = _ctx.Rooms.Any(r => r.Name == request.RoomName);
        if (!roomExists)
        {
            await Clients.Caller.SendRoomNotFound();
            return;
        }
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, request.RoomName);

        _connectionService.RemoveConnectionFromRoom(request.RoomName,
            Guid.Parse(Context.User?.FindFirstValue("userId")!));
        await _service.SendConnectedUsers(request.RoomName);
    }

    [Authorize]
    public async Task SendMessage(SendMessageRequest request)
    {
        var userId = Guid.Parse(Context.User?.FindFirstValue("userId")!);
        var room = await _ctx.Rooms.SingleOrDefaultAsync(r => r.Name == request.RoomName);
        if (room is null)
        {
            await Clients.Caller.SendRoomNotFound();
            return;
        }
        room.Messages.Add(new Message
        {
            Contents = request.Contents,
            UserId = userId,
        });
        await _ctx.SaveChangesAsync();
        var senderUsername = await _ctx.Users
            .Where(u => u.Id == userId)
            .Select(u => u.Username)
            .SingleAsync();
        var response = new MessageResponse(request.Contents, senderUsername);
        await Clients.Group(request.RoomName)
            .SendAsync("receive_message", response);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Guid.Parse(Context.User?.FindFirstValue("userId")!);
        if (_connectionService.RemoveConnection(userId, out var roomName))
        {
            await _service.SendConnectedUsers(roomName!);
        }
        await base.OnDisconnectedAsync(exception);
    }
}
