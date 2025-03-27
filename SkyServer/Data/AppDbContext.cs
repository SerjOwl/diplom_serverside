﻿using Microsoft.EntityFrameworkCore;
using SkyServer.Models;

namespace SkyServer.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Users> users { get; set; }
        public DbSet<CommandLogs> commandlogs { get; set; }
        public DbSet<ErrorLogs> errorlogs { get; set; }
        public DbSet<Hardware> hardware { get; set; }
        public DbSet<Performance> performance { get; set; }
        public DbSet<NeuroLogs> neurologs { get; set; }
    }
}
