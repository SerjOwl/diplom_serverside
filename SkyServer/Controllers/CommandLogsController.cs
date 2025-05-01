// CommandLogsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkyServer.Data;
using SkyServer.Models;

namespace SkyServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommandLogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommandLogsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCommandLogs(
            [FromQuery] int _end = 10,
            [FromQuery] string _order = "ASC",
            [FromQuery] string _sort = "id",
            [FromQuery] int _start = 0,
            [FromQuery] Dictionary<string, string> filter = null)
        {
            int pageSize = _end - _start;
            var query = _context.commandlogs.AsQueryable();

            if (filter != null)
            {
                foreach (var kv in filter)
                {
                    switch (kv.Key.ToLower())
                    {
                        case "command":
                            query = query.Where(c => c.command.Contains(kv.Value));
                            break;
                        case "response":
                            query = query.Where(c => c.response.Contains(kv.Value));
                            break;
                    }
                }
            }

            var sortProperty = _sort.ToLower() switch
            {
                _ => _sort
            };
            query = _order.ToUpper() == "ASC"
                ? query.OrderBy(c => EF.Property<object>(c, sortProperty))
                : query.OrderByDescending(c => EF.Property<object>(c, sortProperty));

            int totalCount = await query.CountAsync();
            var commandLogs = await query
                .Skip(_start)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Append("X-Total-Count", totalCount.ToString());
            Response.Headers.Append("Access-Control-Expose-Headers", "X-Total-Count");

            return Ok(commandLogs);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCommandLog(int id)
        {
            var commandLog = await _context.commandlogs.FindAsync(id);
            return commandLog == null ? NotFound() : Ok(commandLog);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateCommandLog([FromBody] CommandLogs commandLog)
        {
            _context.commandlogs.Add(commandLog);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCommandLog), new { id = commandLog.id }, commandLog);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> EditCommandLog(int id, [FromBody] CommandLogs commandLog)
        {
            if (id != commandLog.id) return BadRequest();

            _context.Entry(commandLog).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteCommandLog(int id)
        {
            await _context.commandlogs.Where(x => x.id == id).ExecuteDeleteAsync();
            return NoContent();
        }
    }
}