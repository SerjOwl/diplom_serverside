using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkyServer.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SkyServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NeurologsStatsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NeurologsStatsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetNeurologsStats()
        {
            // Вызов функции PostgreSQL через SELECT
            var stats = await _context.NeurologStats
                .FromSqlRaw("SELECT * FROM get_neurologs_stats()")
                .ToListAsync();

            return Ok(stats);
        }
    }
}
