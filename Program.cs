using Microsoft.EntityFrameworkCore;
using BobaLite.Data;
using BobaLite.Services;
using BobaLite.Models;

var builder = WebApplication.CreateBuilder(args);

// MVC + Controllers
builder.Services.AddControllersWithViews();

// EF Core + SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=drinks.db"));

// Repositories & Services
builder.Services.AddScoped<IProductRepository, EfProductRepository>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

// Session (in-memory, backed by a cookie)
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.Cookie.Name      = ".BobaLite.Cart";
    options.Cookie.HttpOnly  = true;
    options.IdleTimeout       = TimeSpan.FromHours(1);
});

// HttpContextAccessor (needed by CartService)
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// ──────────────────────────────────────────────────
// Apply any pending EF migrations automatically
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}
// ──────────────────────────────────────────────────

// Static files
app.UseDefaultFiles();
app.UseStaticFiles();

// Routing needs to be established before you consume session in routed middleware
app.UseRouting();

// Session middleware (must come before routing/controllers)
app.UseSession();

// Routing & Controllers
app.UseRouting();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}"
    );
});

app.Run();
