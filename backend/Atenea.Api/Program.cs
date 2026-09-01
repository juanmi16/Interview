using Atenea.Api.Middleware;
using Atenea.Application.Interfaces;
using Atenea.Application.Services;
using Atenea.Domain.Interfaces;
using Atenea.Infrastructure.Data;
using Atenea.Infrastructure.Repositories;
using Atenea.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();



builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//REPOSITORIES
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<ITodoRepository, TodoRepository>();



//Services 

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITodoService, TodoService>();


//JWT Authentication
var jwt = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,                                    // ✍️ verifica la FIRMA
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!)),
            ValidateIssuer = true,
            ValidIssuer = jwt["Issuer"],               // quién lo emitió
            ValidateAudience = true,
            ValidAudience = jwt["Audience"],           // para quién es
            ValidateLifetime = true                                            // ⏰ que no esté vencido
        };
    });

// CORS: allowed frontend origins come from config ("Cors:Origins", comma-separated),
// so the deployed frontend URL can be set on the host WITHOUT a code change.
// Defaults to the local Vite dev servers.
var corsOrigins = (builder.Configuration["Cors:Origins"]
        ?? "http://localhost:5173,http://localhost:5174")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// Apply any pending EF migrations on startup, so the (cloud) database schema
// is created/updated automatically the first time the app deploys.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();   
app.UseAuthorization();

app.MapControllers();

app.Run();
