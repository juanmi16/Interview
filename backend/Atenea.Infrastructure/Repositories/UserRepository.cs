using Atenea.Domain.Entities;
using Atenea.Domain.Interfaces;
using Atenea.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Atenea.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> CreateUser(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> EmailExists(string email)
        {
            return await _context.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Users
                .Include(x => x.Role)   // load the Role so the token's role claim isn't empty
                .FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower());
        }

        public async Task<(List<User> items, int total)> GetUsers(int page, int pageSize, string? search)
        {
            IQueryable<User> query = _context.Users.Include(x => x.Role);

            // filtro de búsqueda (nombre, apellido o email) — solo si hay término
            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.ToLower();
                query = query.Where(u =>
                    u.FirstName.ToLower().Contains(s) ||
                    u.LastName.ToLower().Contains(s) ||
                    u.Email.ToLower().Contains(s));
            }

            query = query.OrderByDescending(x => x.CreatedAt);   // orden DESPUÉS del filtro

            var total = await query.CountAsync();          // total del resultado FILTRADO
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }

        public async Task<User?> UpdateUser(int id, User user)
        {
            // cargamos el existente (con su Role) y copiamos SOLO lo editable.
            // Así NO pisamos PasswordHash, RoleId ni CreatedAt.
            var existing = await _context.Users
                .Include(x => x.Role)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (existing == null) return null;

            existing.FirstName = user.FirstName;
            existing.LastName = user.LastName;
            existing.Email = user.Email;
            existing.Phone = user.Phone;
            existing.IsActive = user.IsActive;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;
            user.IsActive = false;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }

        // Aggregated counts computed in the database (COUNT queries, no data loaded).
        public async Task<(int total, int active, int admins)> GetStats()
        {
            var total = await _context.Users.CountAsync();
            var active = await _context.Users.CountAsync(u => u.IsActive);
            var admins = await _context.Users.CountAsync(u => u.Role != null && u.Role.Name == "Admin");
            return (total, active, admins);
        }
    }
}
