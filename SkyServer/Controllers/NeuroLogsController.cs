// NeuroLogsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkyServer.Data;
using SkyServer.Models;

namespace SkyServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NeuroLogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NeuroLogsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetNeuroLogs(
            [FromQuery] int _end = 10,
            [FromQuery] string _order = "ASC",
            [FromQuery] string _sort = "id",
            [FromQuery] int _start = 0,
            [FromQuery] Dictionary<string, string> filter = null)
        {
            int pageSize = _end - _start;
            var query = _context.neurologs.AsQueryable();

            if (filter != null)
            {
                foreach (var kv in filter)
                {
                    switch (kv.Key.ToLower())
                    {
                        case "prompt":
                            query = query.Where(n => n.prompt.Contains(kv.Value));
                            break;
                        case "error_messagge":
                            query = query.Where(n => n.error_message.Contains(kv.Value));
                            break;
                    }
                }
            }

            var sortProperty = _sort.ToLower() switch
            {
                _ => _sort
            };
            query = _order.ToUpper() == "ASC"
                ? query.OrderBy(n => EF.Property<object>(n, sortProperty))
                : query.OrderByDescending(n => EF.Property<object>(n, sortProperty));

            int totalCount = await query.CountAsync();
            var neuroLogs = await query
                .Skip(_start)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Append("X-Total-Count", totalCount.ToString());
            Response.Headers.Append("Access-Control-Expose-Headers", "X-Total-Count");

            return Ok(neuroLogs);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetNeuroLog(int id)
        {
            var neuroLog = await _context.neurologs.FindAsync(id);
            return neuroLog == null ? NotFound() : Ok(neuroLog);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateNeuroLog([FromBody] NeuroLogs neuroLog)
        {
            neuroLog.created_at = neuroLog.created_at.ToUniversalTime();
            _context.neurologs.Add(neuroLog);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetNeuroLog), new { id = neuroLog.id }, neuroLog);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> EditNeuroLog(int id, [FromBody] NeuroLogs neuroLog)
        {
            if (id != neuroLog.id) return BadRequest();

            _context.Entry(neuroLog).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteNeuroLog(int id)
        {
            await _context.neurologs.Where(x => x.id == id).ExecuteDeleteAsync();
            return NoContent();
        }
    }
}