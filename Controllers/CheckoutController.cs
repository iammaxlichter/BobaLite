using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BobaLite.DTOs;
using BobaLite.Data;
using BobaLite.Models;

namespace BobaLite.Controllers
{
    [ApiController]
    public class CheckoutController : Controller
    {
        private readonly AppDbContext _db;
        private readonly ILogger<CheckoutController> _logger;

        public CheckoutController(AppDbContext db, ILogger<CheckoutController> logger)
        {
            _db     = db;
            _logger = logger;
        }

        // Renders the checkout page
        [HttpGet("/Checkout")]
        public IActionResult Index()
        {
            return View();
        }

        // Receives the JSON payload, decrements stock, and returns success
        [HttpPost("/api/checkout")]
        public IActionResult PlaceOrder([FromBody] CheckoutOrderDto order)
        {
            _logger.LogInformation("Received order: {@Order}", order);

            foreach (var item in order.Items)
            {
                // Lookup by Variant.Id
                var variant = _db.Variants.Find(item.VariantId);
                if (variant != null)
                {
                    variant.Stock = System.Math.Max(0, variant.Stock - item.Quantity);
                }
            }

            _db.SaveChanges();
            return Ok(new { success = true });
        }
    }
}
