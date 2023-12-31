﻿using ChattR.Services;
using ChattR.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChattR.Controllers;

[ApiController]
[Route("/api/rooms")]
public class RoomsController : ControllerBase
{
    private readonly DataContext ctx;
    private readonly ChatHubService chatHubService;

    public RoomsController(DataContext ctx, ChatHubService chatHubService)
    {
        this.ctx = ctx;
        this.chatHubService = chatHubService;
    }

    [HttpPost]
    [Route("create")]
    [Authorize]
    public async Task<IActionResult> CreateRoom(string roomName, CancellationToken cancellationToken)
    {
        var currUser = HttpContext.User.FindFirstValue("userId")!;
        var newRoom = new Room
        {
            UserId = Guid.Parse(currUser),
            Name = roomName,
        };
        ctx.Rooms.Add(newRoom);
        await ctx.SaveChangesAsync(cancellationToken);

        await chatHubService.NotifyUsersForNewRoom();

        return Ok();
    }

    [HttpGet]
    [Route("all")]
    public async Task<IActionResult> GetAllRooms(CancellationToken cancellationToken)
    {
        var rooms = await ctx.Rooms
            .Select(r => new RoomResponse(r.Name, r.User.Username))
            .ToListAsync(cancellationToken);
        return Ok(new AllRoomResponse { Rooms = rooms });
    }
}

internal class AllRoomResponse
{
    public ICollection<RoomResponse> Rooms { get; set; }
}