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
            // pull products and their variants
            var products = _context.Products
                                   .Include(p => p.Variants)
                                   .ToList();

            return View(products);
        }
    }
}