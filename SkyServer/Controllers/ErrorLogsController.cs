// ErrorLogsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkyServer.Data;
using SkyServer.Models;

namespace SkyServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ErrorLogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ErrorLogsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetErrorLogs(
            [FromQuery] int _end = 10,
            [FromQuery] string _order = "ASC",
            [FromQuery] string _sort = "id",
            [FromQuery] int _start = 0,
            [FromQuery] Dictionary<string, string> filter = null)
        {
            int pageSize = _end - _start;
            var query = _context.errorlogs.AsQueryable();

            if (filter != null)
            {
                foreach (var kv in filter)
                {
                    switch (kv.Key.ToLower())
                    {
                        case "error_type":
                            query = query.Where(e => e.error_type.Contains(kv.Value));
                            break;
                        case "error_message":
                            query = query.Where(e => e.error_message.Contains(kv.Value));
                            break;
                    }
                }
            }

            var sortProperty = _sort.ToLower() switch
            {
                _ => _sort
            };
            query = _order.ToUpper() == "ASC"
                ? query.OrderBy(e => EF.Property<object>(e, sortProperty))
                : query.OrderByDescending(e => EF.Property<object>(e, sortProperty));

            int totalCount = await query.CountAsync();
            var errorLogs = await query
                .Skip(_start)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Append("X-Total-Count", totalCount.ToString());
            Response.Headers.Append("Access-Control-Expose-Headers", "X-Total-Count");

            return Ok(errorLogs);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetErrorLog(int id)
        {
            var errorLog = await _context.errorlogs.FindAsync(id);
            return errorLog == null ? NotFound() : Ok(errorLog);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateErrorLog([FromBody] ErrorLogs errorLog)
        {
            errorLog.created_at = errorLog.created_at.ToUniversalTime();
            _context.errorlogs.Add(errorLog);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetErrorLog), new { id = errorLog.id }, errorLog);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> EditErrorLog(int id, [FromBody] ErrorLogs errorLog)
        {
            if (id != errorLog.id) return BadRequest();

            _context.Entry(errorLog).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteErrorLog(int id)
        {
            await _context.errorlogs.Where(x => x.id == id).ExecuteDeleteAsync();
            return NoContent();
        }
    }
}