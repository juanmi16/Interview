using Atenea.Application.DTOS;
using Atenea.Application.Interfaces;
using Atenea.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Atenea.Api.Controllers
{
    [ApiController]
    [Route("api/todos")]
    [Authorize] // any authenticated user manages THEIR OWN to-dos
    public class TodosController : ControllerBase
    {
        private readonly ITodoService _todoService;

        public TodosController(ITodoService todoService)
        {
            _todoService = todoService;
        }

        // the current user's id, read from the JWT
        private int UserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        [HttpGet] // GET /api/todos
        public async Task<IActionResult> GetMyTodos()
        {
            var items = await _todoService.GetMyTodos(UserId);
            return Ok(items.Select(Project));
        }

        [HttpPost] // POST /api/todos
        public async Task<IActionResult> Create([FromBody] CreateTodoDto dto)
        {
            var item = await _todoService.Create(UserId, dto);
            return Ok(Project(item));
        }

        [HttpPut("{id}/toggle")] // PUT /api/todos/5/toggle
        public async Task<IActionResult> Toggle(int id)
        {
            var item = await _todoService.Toggle(id, UserId);
            if (item == null) return NotFound();
            return Ok(Project(item));
        }

        [HttpDelete("{id}")] // DELETE /api/todos/5
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _todoService.Delete(id, UserId);
            if (!ok) return NotFound();
            return Ok(true);
        }

        // safe projection (no UserId / User navigation leaking out)
        private static object Project(TodoItem t) => new
        {
            t.Id,
            t.Title,
            t.IsDone,
            t.CreatedAt
        };
    }
}
