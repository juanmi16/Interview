namespace Atenea.Application.DTOS
{
    // Register DTO: the data the client sends to create an account.
    // The password comes in PLAIN text; the server hashes it before saving.
    public class RegisterDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
