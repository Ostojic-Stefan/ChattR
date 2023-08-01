using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChattR.Controllers;

[ApiController]
[Authorize]
[Route("/api/rooms")]
public class RoomsController : ControllerBase
{
    private readonly DataContext ctx;

    public RoomsController(DataContext ctx)
    {
        this.ctx = ctx;
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
        return Ok(newRoom);
    }

    [HttpGet]
    [Route("all")]
    public async Task<IActionResult> GetAllRooms(CancellationToken cancellationToken)
        => Ok(await ctx.Rooms.ToListAsync(cancellationToken));
}
