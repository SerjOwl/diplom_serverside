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

        // Получение всех записей о производительности
        [HttpGet("GetPerformances")]
        public async Task<IActionResult> GetPerformances()
        {
            var result = await _context.performance.Select(x => new Performance()
            {
                performance_id = x.performance_id,
                user_id = x.user_id,
                cpu_usage = x.cpu_usage,
                memory_usage = x.memory_usage,
                disk_usage = x.disk_usage,
                gpu_usage = x.gpu_usage,
                network_usage = x.network_usage,
                response_latency = x.response_latency,
                created_at = x.created_at
            }).ToListAsync();

            return Ok(result);
        }

        // Создание новой записи о производительности
        [HttpPost("CreatePerformance")]
        public async Task<IActionResult> CreatePerformance([FromBody] Performance performance)
        {
            _context.performance.Add(performance);
            await _context.SaveChangesAsync();

            return Ok(performance);
        }

        // Редактирование записи о производительности
        [HttpPut("EditPerformance")]
        public async Task<IActionResult> EditPerformance([FromBody] Performance performance)
        {
            var rows = await _context.performance.Where(x => x.performance_id == performance.performance_id)
                .ExecuteUpdateAsync(x => x
                .SetProperty(x => x.user_id, performance.user_id)
                .SetProperty(x => x.cpu_usage, performance.cpu_usage)
                .SetProperty(x => x.memory_usage, performance.memory_usage)
                .SetProperty(x => x.disk_usage, performance.disk_usage)
                .SetProperty(x => x.gpu_usage, performance.gpu_usage)
                .SetProperty(x => x.network_usage, performance.network_usage)
                .SetProperty(x => x.response_latency, performance.response_latency)
                .SetProperty(x => x.created_at, performance.created_at)
                );

            return Ok(performance);
        }

        // Удаление записи о производительности
        [HttpDelete("DeletePerformance")]
        public async Task<IActionResult> DeletePerformance(int performance_id)
        {
            var rows = await _context.performance.Where(x => x.performance_id == performance_id).ExecuteDeleteAsync();

            return Ok(true);
        }
    }
}