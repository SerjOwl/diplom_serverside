using System.ComponentModel.DataAnnotations;

namespace SkyServer.Models
{
    public class Hardware
    {
        [Key]
        public int hardware_id { get; set; }
        public int user_id { get; set; }
        public string cpu_model { get; set; }
        public string gpu_model { get; set; }
        public string ram_amount { get; set; }
    }
}
