// PerformanceController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkyServer.Data;
using SkyServer.Models;

namespace SkyServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PerformanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PerformanceController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPerformances(
            [FromQuery] int _end = 10,
            [FromQuery] string _order = "ASC",
            [FromQuery] string _sort = "id",
            [FromQuery] int _start = 0,
            [FromQuery] Dictionary<string, string> filter = null)
        {
            int pageSize = _end - _start;
            var query = _context.performance.AsQueryable();

            if (filter != null)
            {
                foreach (var kv in filter)
                {
                    switch (kv.Key.ToLower())
                    {
                        case "user_id":
                            if (int.TryParse(kv.Value, out int userId))
                                query = query.Where(p => p.user_id == userId);
                            break;
                    }
                }
            }

            var sortProperty = _sort.ToLower() switch
            {
                _ => _sort
            };
            query = _order.ToUpper() == "ASC"
                ? query.OrderBy(p => EF.Property<object>(p, sortProperty))
                : query.OrderByDescending(p => EF.Property<object>(p, sortProperty));

            int totalCount = await query.CountAsync();
            var performances = await query
                .Skip(_start)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Append("X-Total-Count", totalCount.ToString());
            Response.Headers.Append("Access-Control-Expose-Headers", "X-Total-Count");

            return Ok(performances);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPerformance(int id)
        {
            var performance = await _context.performance.FindAsync(id);
            return performance == null ? NotFound() : Ok(performance);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> CreatePerformance([FromBody] Performance performance)
        {
            performance.created_at = performance.created_at.ToUniversalTime();
            _context.performance.Add(performance);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPerformance), new { id = performance.id }, performance);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> EditPerformance(int id, [FromBody] Performance performance)
        {
            if (id != performance.id) return BadRequest();

            _context.Entry(performance).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeletePerformance(int id)
        {
            await _context.performance.Where(x => x.id == id).ExecuteDeleteAsync();
            return NoContent();
        }
    }
}