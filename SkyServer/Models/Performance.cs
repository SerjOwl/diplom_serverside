using System.ComponentModel.DataAnnotations;

namespace SkyServer.Models
{
    public class Performance
    {
        [Key]
        public int performance_id { get; set; }
        public int user_id { get; set; }
        public float cpu_usage { get; set; }
        public float memory_usage { get; set; }
        public float disk_usage { get; set; }
        public float gpu_usage { get; set; }
        public float network_usage { get; set; }
        public float response_latency { get; set; }
        public DateTime created_at { get; set; }
    }
}
