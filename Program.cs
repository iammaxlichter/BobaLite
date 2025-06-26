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


// ✅ SEED DUMMY DATA
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    context.Database.EnsureCreated();

    if (!context.Drinks.Any())
    {
        var classic = new Drink { Name = "Classic Milk Tea" };
        classic.Variants.Add(new DrinkVariant { Name = "Single Can", Price = 3.99M, Quantity = 1 });
        classic.Variants.Add(new DrinkVariant { Name = "6 Pack", Price = 21.99M, Quantity = 6 });
        classic.Variants.Add(new DrinkVariant { Name = "12 Pack", Price = 39.99M, Quantity = 12 });

        var taro = new Drink { Name = "Taro Milk Tea" };
        taro.Variants.Add(new DrinkVariant { Name = "Single Can", Price = 4.29M, Quantity = 1 });
        taro.Variants.Add(new DrinkVariant { Name = "6 Pack", Price = 24.99M, Quantity = 6 });
        taro.Variants.Add(new DrinkVariant { Name = "12 Pack", Price = 44.99M, Quantity = 12 });

        var mango = new Drink { Name = "Mango Green Tea" };
        mango.Variants.Add(new DrinkVariant { Name = "Single Can", Price = 3.59M, Quantity = 1 });
        mango.Variants.Add(new DrinkVariant { Name = "6 Pack", Price = 20.99M, Quantity = 6 });
        mango.Variants.Add(new DrinkVariant { Name = "12 Pack", Price = 38.99M, Quantity = 12 });

        context.Drinks.AddRange(classic, taro, mango);
        context.SaveChanges();
    }
}
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
