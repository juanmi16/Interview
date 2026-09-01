using Atenea.Domain.Entities;

namespace Atenea.Domain.Interfaces
{
    public interface ITodoRepository
    {
        Task<List<TodoItem>> GetByUser(int userId);
        Task<TodoItem> Create(TodoItem item);
        Task<TodoItem?> Toggle(int id, int userId);
        Task<bool> Delete(int id, int userId);
    }
}
