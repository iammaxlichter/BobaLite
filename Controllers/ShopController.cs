// Controllers/ShopController.cs
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using BobaLite.Data;
using BobaLite.DTOs;
using BobaLite.Services;
using BobaLite.ViewModels;

namespace BobaLite.Controllers
{
    public class ShopController : Controller
    {
        private readonly IProductRepository _products;
        private readonly ICategoryService   _cats;

        public ShopController(
            IProductRepository products,
            ICategoryService   cats)
        {
            _products = products;
            _cats     = cats;
        }

        // GET /Shop?categories=milk-tea,shorts
        [HttpGet("/Shop")]
        public IActionResult Index([FromQuery] string[] categories)
        {
            // 1. Always pull your four groups + leaves for the sidebar
            var groups = _cats.GetFilterGroups();

            // 2. If any leaf slugs were passed, filter; otherwise return all
            var allItems = (categories?.Any() == true)
                        ? _products.GetByCategorySlugs(categories)
                        : _products.GetAll();

            var items = allItems.Where(p => p.IsActive).ToList();


            // 3. Pack into a ViewModel
            var vm = new ShopViewModel
            {
                FilterGroups     = groups,
                ActiveCategories = categories ?? Enumerable.Empty<string>(),
                Products         = items
            };

            return View(vm);
        }
    }
}
