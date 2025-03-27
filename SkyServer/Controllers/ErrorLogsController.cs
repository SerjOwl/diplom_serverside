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

        // Метод для получения всех записей об ошибках
        [HttpGet("GetErrorLogs")]
        public async Task<IActionResult> GetErrorLogs()
        {
            var result = await _context.errorlogs.Select(x => new ErrorLogs()
            {
                errorlog_id = x.errorlog_id,
                user_id = x.user_id,
                error_type = x.error_type,
                error_message = x.error_message,
                stack_trace = x.stack_trace,
                created_at = x.created_at
            }).ToListAsync();

            return Ok(result);
        }

        // Метод для создания новой записи об ошибке
        [HttpPost("CreateErrorLog")]
        public async Task<IActionResult> CreateErrorLog([FromBody] ErrorLogs errorlog)
        {
            _context.errorlogs.Add(errorlog);
            await _context.SaveChangesAsync();

            return Ok(errorlog);
        }

        // Метод для редактирования записи об ошибке
        [HttpPut("EditErrorLog")]
        public async Task<IActionResult> EditErrorLog([FromBody] ErrorLogs errorlog)
        {
            var rows = await _context.errorlogs.Where(x => x.errorlog_id == errorlog.errorlog_id)
                .ExecuteUpdateAsync(x => x
                .SetProperty(x => x.user_id, errorlog.user_id)
                .SetProperty(x => x.error_type, errorlog.error_type)
                .SetProperty(x => x.error_message, errorlog.error_message)
                .SetProperty(x => x.stack_trace, errorlog.stack_trace)
                .SetProperty(x => x.created_at, errorlog.created_at)
                );

            return Ok(errorlog);
        }

        // Метод для удаления записи об ошибке
        [HttpDelete("DeleteErrorLog")]
        public async Task<IActionResult> DeleteErrorLog(int errorlog_id)
        {
            var rows = await _context.errorlogs.Where(x => x.errorlog_id == errorlog_id).ExecuteDeleteAsync();

            return Ok(true);
        }
    }
}