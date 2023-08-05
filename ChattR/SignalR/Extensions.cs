using Microsoft.AspNetCore.SignalR;

namespace ChattR.SignalR;

public static class Extensions
{
    public static Task SendRoomNotFound(this ISingleClientProxy client, CancellationToken cancellationToken)
    {
        return client.SendAsync("notify_error",
                new ErrorResponse("provided room does not exist", 404),
                cancellationToken);
    }
}
