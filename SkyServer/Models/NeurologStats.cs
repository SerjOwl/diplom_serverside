using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace SkyServer.Models
{
    [Keyless]
    public class NeurologStats
    {
        public DateTime session_date { get; set; }
        public TimeSpan avg_response_time { get; set; }
        public double avg_input_tokens { get; set; }
        public double avg_output_tokens { get; set; }
        public int total_requests { get; set; }
    }
}
