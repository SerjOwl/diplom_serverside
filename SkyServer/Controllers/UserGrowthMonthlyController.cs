using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkyServer.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SkyServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserGrowthMonthlyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserGrowthMonthlyController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserGrowthMonthly()
        {
            // Вызов функции PostgreSQL через SELECT
            var stats = await _context.UserGrowthMonthly
                .FromSqlRaw("SELECT * FROM get_users_by_month()")
                .ToListAsync();

            return Ok(stats);
        }
    }
}
