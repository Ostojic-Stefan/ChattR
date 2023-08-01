using Microsoft.EntityFrameworkCore;

namespace ChattR;

#nullable disable

public class User
{
	public Guid Id { get; set; }
	public required string Username { get; set; }
	public required string Password { get; set; }

    public ICollection<Message> Messages { get; set; }
}

public class Message
{
	public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid RoomId { get; set; }
    public required string Contents { get; set; }
}

public class Room
{
    public Guid Id { get; set; }
	public Guid UserId { get; set; }
	public required string Name { get; set; }

	public ICollection<Message> Messages { get; set; } = new List<Message>();
	public ICollection<User> Users { get; set; }
}

public class DataContext : DbContext
{
	public DataContext(DbContextOptions<DataContext> options)
		: base(options)
	{
	}

    public DbSet<User> Users { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<Message> Messages { get; set; }
}
