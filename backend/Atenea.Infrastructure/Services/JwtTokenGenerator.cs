using Atenea.Application.Interfaces;
using Atenea.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Atenea.Infrastructure.Services
{
    public class JwtTokenGenerator : IJwtTokenGenerator
    {
        // Injected to read the "Jwt" section from appsettings.
        private readonly IConfiguration _config;

        public JwtTokenGenerator(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(User user)
        {
            // 1) Read the "Jwt" config (Key, Issuer, Audience, ExpireMinutes)
            var key = _config["Jwt:Key"]!;
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var minutes = int.Parse(_config["Jwt:ExpireMinutes"]!);

            // 2) Secret key (text) -> bytes -> SecurityKey object
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

            // 3) How the token is SIGNED: the key + HMAC-SHA256 algorithm
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // 4) CLAIMS = the data stored INSIDE the token (the payload)
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // who (id)
                new Claim(ClaimTypes.Email, user.Email),                  // email
                new Claim(ClaimTypes.Role, user.Role?.Name ?? string.Empty), // role (requires Role loaded)
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}") // full name
            };

            // 5) Build the token: issuer, audience, claims, expiration and signature
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(minutes),
                signingCredentials: credentials
            );

            // 6) Serialize the token to a string (this is what we return to the client)
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
