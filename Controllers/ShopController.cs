using BobaLite.Data;
using BobaLite.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BobaLite.Controllers
{
    public class ShopController : Controller
    {
        private readonly AppDbContext _context;

        public ShopController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var drinks = _context.Drinks
                .Include(d => d.Variants)
                .ToList();

                
                Console.WriteLine($"Found {drinks.Count} drinks");
                
            return View(drinks);
        }
    }
}