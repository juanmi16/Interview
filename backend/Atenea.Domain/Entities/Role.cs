namespace Atenea.Domain.Entities;

// Role defines WHAT a user can do (Admin, Viewer, User).
public class Role
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;   // "Admin", "Viewer", "User"

    // A role can be held by MANY users (1-to-many).
    public List<User> Users { get; set; } = new();
}
