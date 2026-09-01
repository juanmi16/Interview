using Atenea.Application.DTOS;
using Atenea.Domain.Entities;

namespace Atenea.Application.Interfaces
{
    public interface ITodoService
    {
        Task<List<TodoItem>> GetMyTodos(int userId);
        Task<TodoItem> Create(int userId, CreateTodoDto dto);
        Task<TodoItem?> Toggle(int id, int userId);
        Task<bool> Delete(int id, int userId);
    }
}
