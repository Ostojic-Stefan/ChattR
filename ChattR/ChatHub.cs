using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChattR;

public class ChatHub : Hub
{
    private readonly DataContext ctx;

    public ChatHub(DataContext ctx)
	{
        this.ctx = ctx;
    }

    [Authorize]
    public async Task<JoinRoomResponse> JoinRoom(string roomName)
    {
        var room = await ctx.Rooms
            .Include(r => r.Messages)
            .FirstOrDefaultAsync(r => r.Name == roomName);

        if (room is not null)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
            var res = new JoinRoomResponse
            {
                MessagesHistory = room.Messages
            };
            return res;
        }

        return null;
    }

    [Authorize]
    public Task LeaveRoom(string roomName)
        => Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);

    [Authorize]
    public async Task SendMessage(string contents, string roomName)
    {
        var userId = Context.User?.FindFirstValue("userId");

        if (userId is null)
            return;

        var room = await ctx.Rooms.SingleAsync(r => r.Name == roomName);

        var msg = new Message
        {
            Contents = contents,
            UserId = Guid.Parse(userId),
        };

        room.Messages.Add(msg);

        await ctx.SaveChangesAsync();

        await Clients.Group(roomName)
            .SendAsync("send_message", msg);
    }
}

public class JoinRoomResponse
{
    public required ICollection<Message> MessagesHistory { get; set; }
}