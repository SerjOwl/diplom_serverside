using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace SkyServer.Models
{
    [Keyless]
    public class UserGrowthMonthly
    {
        public DateTime month { get; set; }
        public double user_count { get; set; }
    }
}
