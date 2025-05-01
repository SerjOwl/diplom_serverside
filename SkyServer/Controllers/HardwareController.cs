// HardwareController.cs
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

        [HttpGet]
        public async Task<IActionResult> GetHardware(
            [FromQuery] int _end = 10,
            [FromQuery] string _order = "ASC",
            [FromQuery] string _sort = "id",
            [FromQuery] int _start = 0,
            [FromQuery] Dictionary<string, string> filter = null)
        {
            int pageSize = _end - _start;
            var query = _context.hardware.AsQueryable();

            if (filter != null)
            {
                foreach (var kv in filter)
                {
                    switch (kv.Key.ToLower())
                    {
                        case "cpu_model":
                            query = query.Where(h => h.cpu_model.Contains(kv.Value));
                            break;
                        case "gpu_model":
                            query = query.Where(h => h.gpu_model.Contains(kv.Value));
                            break;
                    }
                }
            }

            var sortProperty = _sort.ToLower() switch
            {
                _ => _sort
            };
            query = _order.ToUpper() == "ASC"
                ? query.OrderBy(h => EF.Property<object>(h, sortProperty))
                : query.OrderByDescending(h => EF.Property<object>(h, sortProperty));

            int totalCount = await query.CountAsync();
            var hardware = await query
                .Skip(_start)
                .Take(pageSize)
                .ToListAsync();

            Response.Headers.Append("X-Total-Count", totalCount.ToString());
            Response.Headers.Append("Access-Control-Expose-Headers", "X-Total-Count");

            return Ok(hardware);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetHardware(int id)
        {
            var hardware = await _context.hardware.FindAsync(id);
            return hardware == null ? NotFound() : Ok(hardware);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateHardware([FromBody] Hardware hardware)
        {
            _context.hardware.Add(hardware);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHardware), new { id = hardware.id }, hardware);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> EditHardware(int id, [FromBody] Hardware hardware)
        {
            if (id != hardware.id) return BadRequest();

            _context.Entry(hardware).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteHardware(int id)
        {
            await _context.hardware.Where(x => x.id == id).ExecuteDeleteAsync();
            return NoContent();
        }
    }
}