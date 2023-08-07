using ChattR.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChattR.Services;

public class ChatHubService
{
    private readonly DataContext _ctx;
    private readonly IHubContext<ChatHub> _chatHub;
    private readonly ConnectionService _connectionService;

    public ChatHubService(DataContext ctx, IHubContext<ChatHub> chatHub, ConnectionService connectionService)
	{
        _ctx = ctx;
        _chatHub = chatHub;
        _connectionService = connectionService;
    }

    public async Task NotifyUsersForNewRoom()
    {
        var rooms = await _ctx.Rooms
            .Select(r => new RoomResponse(r.Name, r.User.Username))
            .ToListAsync();
        await _chatHub.Clients.All.SendAsync("receive_all_rooms", new AllRoomsResponse(rooms));
    }

    public async Task SendConnectedUsers(string roomName, CancellationToken cancellationToken = default)
    {
        var userIds = _connectionService.GetConnectedUsersForRoom(roomName);
        var users = await _ctx.Users.Where(u => userIds.Contains(u.Id))
            .ToListAsync(cancellationToken);
        await _chatHub.Clients.Group(roomName).SendAsync("users_in_room", new UsersInRoomResponse(users), cancellationToken);
    }
}
