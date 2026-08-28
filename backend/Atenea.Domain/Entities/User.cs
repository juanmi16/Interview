namespace Atenea.Domain.Entities;

// System user: the person who logs in (investor, admin, etc.).
public class User
{
    public int Id { get; set; }

    // --- Personal data ---
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;   // used to log in (unique)
    public string Phone { get; set; } = string.Empty;

    // --- Security ---
    public string PasswordHash { get; set; } = string.Empty; // the HASH, never the real password

    // --- Audit ---
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; } = true;

    // --- Role (FK): a user has ONE role ---
    public int RoleId { get; set; }
    public Role? Role { get; set; }
}
