using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkyServer.Data;
using SkyServer.Models;
using System.Threading.Tasks;

namespace SkyServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ErrorStatsDailyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ErrorStatsDailyController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetErrorStatsDaily()
        {
            var stats = await _context.ErrorStatsDaily
                .FromSqlRaw("SELECT * FROM get_error_stats_daily()")
                .ToListAsync();

            return Ok(stats);
        }
    }
}
