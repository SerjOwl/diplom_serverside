using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkyServer.Data;
using SkyServer.Models;

namespace SkyServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            var result = await _context.users.Select(x => new Users()
            {
                user_id = x.user_id,
                username = x.username,
                email = x.email,
                created_at = x.created_at,
            }).ToListAsync();

            return Ok(result);
        }

        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser([FromBody] Users user)
        {
            _context.users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpPut("EditUser")]
        public async Task<IActionResult> EditUser([FromBody] Users user)
        {
            var rows = await _context.users.Where(x => x.user_id == user.user_id)
                .ExecuteUpdateAsync(x => x
                .SetProperty(x => x.username, user.username)
                .SetProperty(x => x.email, user.email));

            return Ok(user);
        }

        [HttpDelete("DeleteUser")]
        public async Task<IActionResult> DeleteUser(int user_id)
        {
            var rows = await _context.users.Where(x => x.user_id == user_id).ExecuteDeleteAsync();

            return Ok(true);
        }
    }
}
