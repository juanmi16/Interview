using Atenea.Application.DTOS;
using Atenea.Application.Interfaces;
using Atenea.Domain.Entities;
using Atenea.Domain.Interfaces;

namespace Atenea.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _repository;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthService(IUserRepository repository, IJwtTokenGenerator jwtTokenGenerator)
        {
            _repository = repository;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        // "Register" use case: map DTO -> entity, hash the password and save.
        public async Task<User> CreateUser(RegisterDto register)
        {
            if (register is null)
                throw new ArgumentNullException(nameof(register));

            var user = new User
            {
                FirstName = register.FirstName,
                LastName = register.LastName,
                Email = register.Email,
                Phone = register.Phone,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(register.Password), // one-way hash
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                RoleId = 3   // 3 = User (default role)
            };

            return await _repository.CreateUser(user);
        }

        // Delegates to the repo (the one that actually touches the database).
        public async Task<bool> EmailExists(string email)
        {
            return await _repository.EmailExists(email);
        }

        public async Task<string> Login(LoginDto dto)
        {
            var user = await _repository.GetUserByEmail(dto.Email);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid email or password.");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid email or password.");

            // Credentials OK -> generate and return the signed JWT (string).
            return _jwtTokenGenerator.GenerateToken(user);
        }
    }
}
