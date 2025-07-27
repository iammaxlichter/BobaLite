using Microsoft.EntityFrameworkCore;
using BobaLite.Data;
using BobaLite.Services;
using BobaLite.Models;
using System.Globalization;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// ──────────────────────────────────────────────────
// Load local secrets if you have appsettings.Local.json
// (gitignored, so it’s only on your machine)
// ──────────────────────────────────────────────────
builder.Configuration
       .AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true)
       .AddEnvironmentVariables();

// ──────────────────────────────────────────────────
// MVC + Controllers
// ──────────────────────────────────────────────────
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages(); // Needed for /Admin/Login.cshtml

// ──────────────────────────────────────────────────
// EF Core + SQLite
// ──────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=drinks.db"));

// ──────────────────────────────────────────────────
// Repositories & Services
// ──────────────────────────────────────────────────
builder.Services.AddScoped<IProductRepository, EfProductRepository>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// ──────────────────────────────────────────────────
// Cookie Auth (for Admin login)
// ──────────────────────────────────────────────────
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Admin/Login";
        options.Cookie.Name = ".BobaLite.AdminAuth";
        options.ExpireTimeSpan = TimeSpan.FromHours(2);
    });

// ──────────────────────────────────────────────────
// Session (in-memory, backed by a cookie)
// ──────────────────────────────────────────────────
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.Cookie.Name = ".BobaLite.Cart";
    options.Cookie.HttpOnly = true;
    options.IdleTimeout = TimeSpan.FromHours(1);
});

// ──────────────────────────────────────────────────
// HttpContextAccessor (needed by CartService)
// ──────────────────────────────────────────────────
builder.Services.AddHttpContextAccessor();

// ──────────────────────────────────────────────────
// Culture (for currency formatting, etc.)
// ──────────────────────────────────────────────────
CultureInfo.DefaultThreadCurrentCulture = new CultureInfo("en-US");
CultureInfo.DefaultThreadCurrentUICulture = new CultureInfo("en-US");

var app = builder.Build();

// ──────────────────────────────────────────────────
// Migrations
// ──────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// ──────────────────────────────────────────────────
// Middleware pipeline
// ──────────────────────────────────────────────────
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication(); 
app.UseAuthorization();
app.UseStatusCodePages(); 
app.UseSession();

app.UseEndpoints(endpoints =>
{
    endpoints.MapRazorPages();
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");
});

app.Run();
