using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkyServer.Data;
using SkyServer.Models;

namespace SkyServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HardwareController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HardwareController(AppDbContext context)
        {
            _context = context;
        }

        // Получение всех записей о железе
        [HttpGet("GetHardware")]
        public async Task<IActionResult> GetHardware()
        {
            var result = await _context.hardware.Select(x => new Hardware()
            {
                hardware_id = x.hardware_id,
                user_id = x.user_id,
                cpu_model = x.cpu_model,
                gpu_model = x.gpu_model,
                ram_amount = x.ram_amount
            }).ToListAsync();

            return Ok(result);
        }

        // Создание новой записи о железе
        [HttpPost("CreateHardware")]
        public async Task<IActionResult> CreateHardware([FromBody] Hardware hardware)
        {
            _context.hardware.Add(hardware);
            await _context.SaveChangesAsync();

            return Ok(hardware);
        }

        // Редактирование записи о железе
        [HttpPut("EditHardware")]
        public async Task<IActionResult> EditHardware([FromBody] Hardware hardware)
        {
            var rows = await _context.hardware.Where(x => x.hardware_id == hardware.hardware_id)
                .ExecuteUpdateAsync(x => x
                .SetProperty(x => x.user_id, hardware.user_id)
                .SetProperty(x => x.cpu_model, hardware.cpu_model)
                .SetProperty(x => x.gpu_model, hardware.gpu_model)
                .SetProperty(x => x.ram_amount, hardware.ram_amount)
                );

            return Ok(hardware);
        }

        // Удаление записи о железе
        [HttpDelete("DeleteHardware")]
        public async Task<IActionResult> DeleteHardware(int hardware_id)
        {
            var rows = await _context.hardware.Where(x => x.hardware_id == hardware_id).ExecuteDeleteAsync();

            return Ok(true);
        }
    }
}