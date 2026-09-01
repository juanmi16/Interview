namespace Atenea.Domain.Entities
{
    // A personal to-do item that belongs to one user.
    public class TodoItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsDone { get; set; }
        public DateTime CreatedAt { get; set; }

        // FK: each to-do belongs to a user.
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
