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

        // Получение всех нейро-логов
        [HttpGet("GetNeuroLogs")]
        public async Task<IActionResult> GetNeuroLogs()
        {
            var result = await _context.neurologs.Select(x => new NeuroLogs()
            {
                errorlog_id = x.errorlog_id,
                user_id = x.user_id,
                session_id = x.session_id,
                prompt = x.prompt,
                response_time = x.response_time,
                input_tokens = x.input_tokens,
                output_tokens = x.output_tokens,
                error_messagge = x.error_messagge
            }).ToListAsync();

            return Ok(result);
        }

        // Создание нового нейро-лога
        [HttpPost("CreateNeuroLog")]
        public async Task<IActionResult> CreateNeuroLog([FromBody] NeuroLogs neuroLog)
        {
            _context.neurologs.Add(neuroLog);
            await _context.SaveChangesAsync();

            return Ok(neuroLog);
        }

        // Редактирование нейро-лога
        [HttpPut("EditNeuroLog")]
        public async Task<IActionResult> EditNeuroLog([FromBody] NeuroLogs neuroLog)
        {
            var rows = await _context.neurologs.Where(x => x.errorlog_id == neuroLog.errorlog_id)
                .ExecuteUpdateAsync(x => x
                .SetProperty(x => x.user_id, neuroLog.user_id)
                .SetProperty(x => x.session_id, neuroLog.session_id)
                .SetProperty(x => x.prompt, neuroLog.prompt)
                .SetProperty(x => x.response_time, neuroLog.response_time)
                .SetProperty(x => x.input_tokens, neuroLog.input_tokens)
                .SetProperty(x => x.output_tokens, neuroLog.output_tokens)
                .SetProperty(x => x.error_messagge, neuroLog.error_messagge)
                );

            return Ok(neuroLog);
        }

        // Удаление нейро-лога
        [HttpDelete("DeleteNeuroLog")]
        public async Task<IActionResult> DeleteNeuroLog(int errorlog_id)
        {
            var rows = await _context.neurologs.Where(x => x.errorlog_id == errorlog_id).ExecuteDeleteAsync();

            return Ok(true);
        }
    }
}