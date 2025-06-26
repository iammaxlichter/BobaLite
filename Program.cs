using Microsoft.EntityFrameworkCore;
using BobaLite.Data;
using BobaLite.Models;

var builder = WebApplication.CreateBuilder(args);

// Add MVC Services
builder.Services.AddControllersWithViews();

// Add EF Core
builder.Services.AddDbContext<BobaLite.Data.AppDbContext>(options =>
    options.UseSqlite("Data Source=drinks.db"));

// Build the app
var app = builder.Build();


// Serve static files
app.UseDefaultFiles();
app.UseStaticFiles();

// Enable Routing
app.UseRouting();

// Enable Controller Endpoints
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}"
    );
});


// Run the app
app.Run();
