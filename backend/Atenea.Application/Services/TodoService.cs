using Atenea.Application.DTOS;
using Atenea.Application.Interfaces;
using Atenea.Domain.Entities;
using Atenea.Domain.Interfaces;

namespace Atenea.Application.Services
{
    public class TodoService : ITodoService
    {
        private readonly ITodoRepository _repository;

        public TodoService(ITodoRepository repository)
        {
            _repository = repository;
        }

        public Task<List<TodoItem>> GetMyTodos(int userId) => _repository.GetByUser(userId);

        public Task<TodoItem> Create(int userId, CreateTodoDto dto)
        {
            var item = new TodoItem
            {
                Title = dto.Title,
                IsDone = false,
                CreatedAt = DateTime.UtcNow,
                UserId = userId
            };
            return _repository.Create(item);
        }

        public Task<TodoItem?> Toggle(int id, int userId) => _repository.Toggle(id, userId);

        public Task<bool> Delete(int id, int userId) => _repository.Delete(id, userId);
    }
}
