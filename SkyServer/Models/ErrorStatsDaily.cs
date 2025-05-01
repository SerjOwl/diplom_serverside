using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

[Keyless]
public class ErrorStatsDaily
{
    public string error_type { get; set; } = null!;

    public DateTime day { get; set; }

    public long error_count { get; set; }

    public long affected_users { get; set; }
}