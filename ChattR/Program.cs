using ChattR;
using ChattR.Services;
using ChattR.SignalR;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using System.Threading.Channels;
using static ChattR.Controllers.RoomsController;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, o =>
    {
        o.Cookie.Name = "authCookie";
        o.Events.OnRedirectToLogin = (context) =>
        {
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        };
    });

builder.Services.AddScoped<ChatHubService>();
builder.Services.AddSingleton<ConnectionService>();

builder.Services.AddDbContext<DataContext>(
    opt => opt.UseSqlite("DataSource=app.db"));

builder.Services.AddSignalR(opt =>
{
    opt.EnableDetailedErrors = true;
});

var app = builder.Build();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/api/chathub");

app.MapWhen(x => !x.Request.Path.Value.StartsWith("/api"), builder =>
{
    builder.UseSpa(builder => builder.UseProxyToSpaDevelopmentServer("http://localhost:5173"));
});

app.Run();
