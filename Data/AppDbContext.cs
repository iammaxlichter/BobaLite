using Microsoft.EntityFrameworkCore;
using BobaLite.Models;

namespace BobaLite.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Drink> Drinks { get; set; } = null!;
        public DbSet<DrinkVariant> DrinkVariants { get; set; } = null!;
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
