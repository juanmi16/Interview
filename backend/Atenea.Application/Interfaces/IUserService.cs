using Atenea.Application.DTOS;
using Atenea.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Atenea.Application.Interfaces
{
    public  interface IUserService
    {
        Task<(List<User> items, int total)> GetAllUsers(int page, int pageSize, string? search);
        Task<User?> UpdateUser(int id, UpdateUserDto dto);
        Task<Boolean?> DeleteUser(int id);
        Task<UserStatsDto> GetStats();
    }
}
