using Atenea.Application.DTOS;
using Atenea.Application.Interfaces;
using Atenea.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Atenea.Api.Controllers
{

    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }



        [Authorize(Roles = "Admin")]
        [HttpGet] // GET /api/users
        public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var (users, total) = await _userService.GetAllUsers(page, pageSize);

            var items = users.Select(u => new
            {
                u.Id,
                u.FirstName,
                u.LastName,
                u.Email,
                u.Phone,
                u.CreatedAt,
                u.IsActive,
                Role = u.Role?.Name          // ← Role   (aplana a string)
                                             // ⚠️ SIN passwordHash
            });

            return Ok(new { items, total, page, pageSize });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            var u = await _userService.UpdateUser(id, dto);
            if (u == null)
            {
                return NotFound();
            }

            // proyectamos igual que el GET (sin PasswordHash, role como string)
            return Ok(new
            {
                u.Id,
                u.FirstName,
                u.LastName,
                u.Email,
                u.Phone,
                u.CreatedAt,
                u.IsActive,
                Role = u.Role?.Name
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userService.DeleteUser(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(true);
        }

    }
}
