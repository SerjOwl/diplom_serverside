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

        [HttpGet("GetCommandLogs")]
        public async Task<IActionResult> GetCommandLogs()
        {
            var result = await _context.commandlogs.Select(x => new CommandLogs()
            {
                commandlog_id = x.commandlog_id,
                user_id = x.user_id,
                created_at = x.created_at,
                command = x.command,
                response = x.response,
                confidence_level = x.confidence_level,
            }).ToListAsync();

            return Ok(result);
        }

        [HttpPost("CreateCommandLog")]
        public async Task<IActionResult> CreateUser([FromBody] CommandLogs commandlog)
        {
            _context.commandlogs.Add(commandlog);
            await _context.SaveChangesAsync();

            return Ok(commandlog);
        }

        [HttpPut("EditCommandLogs")]
        public async Task<IActionResult> EditCommandLogs([FromBody] CommandLogs commandlog)
        {
            var rows = await _context.commandlogs.Where(x => x.commandlog_id == commandlog.commandlog_id)
                .ExecuteUpdateAsync(x => x
                .SetProperty(x => x.user_id, commandlog.user_id)
                .SetProperty(x => x.created_at, commandlog.created_at)
                .SetProperty(x => x.command, commandlog.command)
                .SetProperty(x => x.response, commandlog.response)
                .SetProperty(x => x.confidence_level, commandlog.confidence_level)
                );

            return Ok(commandlog);
        }

        [HttpDelete("DeleteCommandLogs")]
        public async Task<IActionResult> DeleteCommandLogs(int commandlog_id)
        {
            var rows = await _context.commandlogs.Where(x => x.commandlog_id == commandlog_id).ExecuteDeleteAsync();

            return Ok(true);
        }
    }
}
