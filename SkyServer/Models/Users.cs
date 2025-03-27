using System.ComponentModel.DataAnnotations;

namespace SkyServer.Models
{
    public class Users
    {
        [Key]
        public int user_id { get; set; }
        public string username { get; set; }
        public string email { get; set; }
        public DateTime created_at { get; set; }
    }
}
