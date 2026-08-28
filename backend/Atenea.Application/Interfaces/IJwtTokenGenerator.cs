using Atenea.Domain.Entities;

namespace Atenea.Application.Interfaces
{
    public interface IJwtTokenGenerator
    {
        public string GenerateToken(User user);
    }
}
