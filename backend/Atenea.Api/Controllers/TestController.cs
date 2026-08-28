using Microsoft.AspNetCore.Mvc;

namespace Atenea.Api.Controllers;

// Controller SOLO de prueba (sin lógica): lanza un error a propósito
// para verificar que el middleware global de errores lo atrapa.
[ApiController]
[Route("test")]
public class TestController : ControllerBase
{
    [HttpGet("boom")]
    public IActionResult Boom() => throw new Exception("¡Boom de prueba!");
}
