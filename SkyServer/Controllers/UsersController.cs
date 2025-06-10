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

        [HttpGet]
        public async Task<IActionResult> GetUsers(
            [FromQuery] int _end = 10,
            [FromQuery] string _order = "ASC",
            [FromQuery] string _sort = "id",
            [FromQuery] int _start = 0,
            [FromQuery] Dictionary<string, string> filter = null)
        {
            // Calculate page size
            int pageSize = _end - _start;

            // Base query
            var query = _context.users.AsQueryable();

            // Apply filtering
            if (filter != null)
            {
                foreach (var kv in filter)
                {
                    switch (kv.Key.ToLower())
                    {
                        case "username":
                            query = query.Where(u => u.username.Contains(kv.Value));
                            break;
                        case "email":
                            query = query.Where(u => u.email.Contains(kv.Value));
                            break;
                            // Add other filterable fields
                    }
                }
            }

            // Apply sorting
            var sortProperty = _sort.ToLower() switch
            {
                _ => _sort
            };
            query = _order.ToUpper() == "ASC"
                ? query.OrderBy(u => EF.Property<object>(u, sortProperty))
                : query.OrderByDescending(u => EF.Property<object>(u, sortProperty));

            // Get total count before pagination
            int totalCount = await query.CountAsync();

            // Apply pagination
            var users = await query
                .Skip(_start)
                .Take(pageSize)
                .ToListAsync();

            // Add X-Total-Count header for React-Admin
            Response.Headers.Append("X-Total-Count", totalCount.ToString());
            Response.Headers.Append("Access-Control-Expose-Headers", "X-Total-Count");

            return Ok(users);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.users.FindAsync(id);
            return user == null ? NotFound() : Ok(user);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateUser([FromBody] Users user)
        {
            user.created_at = user.created_at.ToUniversalTime();
            _context.users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.id }, user);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> EditUser(int id, [FromBody] Users user)
        {
            if (id != user.id) return BadRequest();

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _context.users.Where(x => x.id == id).ExecuteDeleteAsync();
            return NoContent();
        }
    }
}
