namespace Atenea.Application.DTOS
{
    // Lo que el cliente PUEDE editar de un usuario (contrato de la API, NO la entidad).
    // Plano: nada de PasswordHash, RoleId ni objeto Role.
    public class UpdateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
