using ChattR.SignalR;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace ChattR.Services;

public class ConnectionService
{
    private readonly ConcurrentDictionary<string, List<Guid>> _connections;

    public ConnectionService()
    {
        _connections = new();
    }

    public IEnumerable<Guid> GetConnectedUsersForRoom(string roomName)
    {
        if (_connections.TryGetValue(roomName, out var users))
        {
            return users;
        }
        return Enumerable.Empty<Guid>();
    }

    public void AddConnectionToRoom(string roomName, Guid userId)
    {
        var users = _connections[roomName];
        users.Add(userId);
    }

    public void RemoveConnectionFromRoom(string roomName, Guid userId)
    {
        var users = _connections[roomName];
        users.Remove(userId);
    }
}
