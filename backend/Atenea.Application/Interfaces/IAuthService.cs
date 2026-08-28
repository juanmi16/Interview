using Atenea.Application.DTOS;
using Atenea.Domain.Entities;

namespace Atenea.Application.Interfaces
{
    public interface IAuthService
    {
        public Task<bool> EmailExists(string email);

        public Task<User> CreateUser(RegisterDto register);

        public Task<string> Login(LoginDto dto);

       
    }
}
