using ChattR.Responses;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChattR.Services;

public class ChatHubService
{
    private readonly DataContext ctx;
    private readonly IHubContext<ChatHub> chatHub;

    public ChatHubService(DataContext ctx, IHubContext<ChatHub> chatHub)
	{
        this.ctx = ctx;
        this.chatHub = chatHub;
    }

    public async Task NotifyUsersForNewRoom()
    {
        var rooms = await ctx.Rooms.Select(r => new RoomResponse
        {
            Name = r.Name,
            OwnerUsername = r.User.Username
        }).ToListAsync();
        await chatHub.Clients.All.SendAsync("receive_all_rooms", rooms);
    }

}
