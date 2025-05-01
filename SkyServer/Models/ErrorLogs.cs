using System.ComponentModel.DataAnnotations;

namespace SkyServer.Models
{
    public class ErrorLogs
    {
        [Key]
        public int id { get; set; }
        public int user_id { get; set; }
        public string error_type { get; set; }
        public string error_message { get; set; }
        public string stack_trace { get; set; }
        public DateTime created_at { get; set; }
    }
}
