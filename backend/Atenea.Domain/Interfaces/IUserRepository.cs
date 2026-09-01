using Atenea.Domain.Entities;

namespace Atenea.Domain.Interfaces
{
    public interface IUserRepository
    {
        public Task<bool> EmailExists(string email);

        public Task<User> CreateUser(User user);

        public Task<User?> GetUserByEmail(string email);

        public Task<(List<User> items, int total)> GetUsers(int page, int pageSize, string? search);

        public Task<User?> UpdateUser(int id, User user);

        public Task<bool> DeleteUser(int id);

        public Task<(int total, int active, int admins)> GetStats();
    }
}
