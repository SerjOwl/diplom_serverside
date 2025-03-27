using System.ComponentModel.DataAnnotations;

namespace SkyServer.Models
{
    public class NeuroLogs
    {
        [Key]
        public int errorlog_id { get; set; }
        public int user_id { get; set; }
        public int session_id { get; set; }
        public string prompt { get; set; }
        public TimeSpan response_time { get; set; }
        public int input_tokens { get; set; }
        public int output_tokens { get; set; }
        public string error_messagge { get; set; }
    }
}
