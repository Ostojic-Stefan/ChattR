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
        if (!_connections.ContainsKey(roomName)) 
        {
            _connections.TryAdd(roomName, new List<Guid>());
        }
        var users = _connections[roomName];
        users.Add(userId);
    }

    public void RemoveConnectionFromRoom(string roomName, Guid userId)
    {
        if (!_connections.ContainsKey(roomName))
        {
            return;
        }
        var users = _connections[roomName];
        users.Remove(userId);
    }

    public bool RemoveConnection(Guid userId, out string? roomName)
    {
        foreach (var entry in _connections)
        {
            if (entry.Value.Contains(userId))
            {
                entry.Value.Remove(userId);
                roomName = entry.Key;
                return true;
            }
        }
        roomName = null;
        return false;
    }
}
