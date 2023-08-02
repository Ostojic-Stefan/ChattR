using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChattR.Controllers;

public record UserRegister(string Username, string Password);

[ApiController]
[Route("/api/auth")]
public class AuthController : ControllerBase
{
    private readonly DataContext _ctx;

    public AuthController(DataContext ctx)
    {
        _ctx = ctx;
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register(UserRegister model, CancellationToken cancellationToken)
    {
        var user = new User { Username = model.Username, Password = model.Password };

        var userExists = await _ctx.Users
            .FirstOrDefaultAsync(u => u.Username == model.Username,
                cancellationToken) is not null;

        if (userExists)
            return BadRequest("User with that username already exists");

        _ctx.Users.Add(user);
        await _ctx.SaveChangesAsync(cancellationToken);

        var claimsIdentity = new ClaimsIdentity(new List<Claim>
            {
                new Claim("username", user.Username),
                new Claim("userId", user.Id.ToString())
            }, CookieAuthenticationDefaults.AuthenticationScheme);
        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal);

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserRegister model, CancellationToken cancellationToken)
    {
        var user = await _ctx.Users.FirstOrDefaultAsync(u => u.Username == model.Username,
            cancellationToken);

        // check for password

        if (user is null)
            return BadRequest("User does not exist");

        var claimsIdentity = new ClaimsIdentity(
            new List<Claim>
            {
                new Claim("username", user.Username),
                new Claim("userId", user.Id.ToString())
            }, CookieAuthenticationDefaults.AuthenticationScheme);
        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal);

        return Ok();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetUserInfo(CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(HttpContext.User.FindFirstValue("userId")!);
        var userInfo = await _ctx.Users.SingleAsync(u => u.Id == userId, cancellationToken);
        return Ok(userInfo);
    }
}
