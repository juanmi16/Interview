using Atenea.Application.DTOS;
using Atenea.Application.Interfaces;
using Atenea.Domain.Entities;
using Atenea.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Atenea.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<(List<User> items, int total)> GetAllUsers(int page, int pageSize)
        {
            return await _userRepository.GetUsers(page, pageSize);
        }

        public async Task<User?> UpdateUser(int id, UpdateUserDto dto)
        {
            // mapeamos el DTO a una entidad "portadora" con SOLO lo editable
            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                IsActive = dto.IsActive
            };
            return await _userRepository.UpdateUser(id, user);
        }

        public async Task<Boolean?> DeleteUser(int id)
        {
            return await _userRepository.DeleteUser(id);
        }

    }
}
