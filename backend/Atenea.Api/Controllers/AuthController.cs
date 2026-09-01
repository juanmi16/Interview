using Atenea.Application.DTOS;
using Atenea.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Atenea.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        // We inject the SERVICE (the logic). The controller touches neither the repo nor the database.
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]              // reachable WITHOUT a token
        [HttpPost("register")]       // POST /api/auth/register
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            // 1) Is the email already taken?
            if (await _authService.EmailExists(dto.Email))
                return BadRequest(new { error = "That email is already registered." });

            // 2) Create the user (the service hashes the password and saves it)
            var user = await _authService.CreateUser(dto);

            // 3) Auto-login: generamos el token para que quede AUTENTICADO al registrarse
            var token = await _authService.Login(new LoginDto { Email = dto.Email, Password = dto.Password });

            // 4) Respond con el token (+ datos no sensibles)
            return Ok(new
            {
                token,
                user.Id,
                user.FirstName,
                user.Email,
                message = "User registered"
            });
        }

        [AllowAnonymous]              // reachable WITHOUT a token
        [HttpPost("login")]          // POST /api/auth/login
        public async Task<IActionResult> Login(LoginDto dto)
        {
            // The service verifies email + password and returns the signed JWT.
            var token = await _authService.Login(dto);
            return Ok(new { token });
        }

        [Authorize]                  // requires a VALID token (no token -> 401)
        [HttpGet("me")]             // GET /api/auth/me
        public IActionResult Me()
        {
            // Read the claims from the validated token.
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var name = User.FindFirst(ClaimTypes.Name)?.Value;
            return Ok(new { id, email, role, name });
        }
    }
}
