using Atenea.Domain.Entities;
using Atenea.Domain.Interfaces;
using Atenea.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Atenea.Infrastructure.Repositories
{
    public class TodoRepository : ITodoRepository
    {
        private readonly AppDbContext _context;

        public TodoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<TodoItem>> GetByUser(int userId)
        {
            return await _context.TodoItems
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<TodoItem> Create(TodoItem item)
        {
            await _context.TodoItems.AddAsync(item);
            await _context.SaveChangesAsync();
            return item;
        }

        // Scoped to the owner: a user can only toggle THEIR own item.
        public async Task<TodoItem?> Toggle(int id, int userId)
        {
            var item = await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (item == null) return null;

            item.IsDone = !item.IsDone;
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<bool> Delete(int id, int userId)
        {
            var item = await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (item == null) return false;

            _context.TodoItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
