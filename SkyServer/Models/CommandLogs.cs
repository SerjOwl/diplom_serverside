using System.ComponentModel.DataAnnotations;

namespace SkyServer.Models
{
    public class CommandLogs
    {
        [Key]
        public int commandlog_id { get; set; }
        public int user_id { get; set; }
        public DateTime created_at { get; set; }
        public string command { get; set; }
        public string response { get; set; }
        public float confidence_level { get; set; }
    }
}
