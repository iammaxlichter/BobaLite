// ───── Framework Usings ─────────────────────────────
using System.Linq;
using Microsoft.AspNetCore.Mvc;

// ───── Project Usings ───────────────────────────────
using BobaLite.Data;
using BobaLite.Services;
using BobaLite.ViewModels;

namespace BobaLite.Controllers
{
    /// <summary>
    /// Handles product browsing and filtering in the shop.
    /// </summary>
    public class ShopController : Controller
    {
        private readonly IProductRepository _products;
        private readonly ICategoryService _cats;

        #region Constructor
        /// <summary>
        /// Initializes a new instance of the <see cref="ShopController"/> class.
        /// </summary>
        public ShopController(IProductRepository products, ICategoryService cats)
        {
            _products = products;
            _cats = cats;
        }
        #endregion

        #region GET Methods
        /// <summary>
        /// Displays the shop page with optional category filtering.
        /// </summary>
        /// <param name="categories">An array of category slugs to filter products by.</param>
        /// <returns>The shop view populated with filtered products and filter groups.</returns>
        [HttpGet("/Shop")]
        public IActionResult Index([FromQuery] string[] categories)
        {
            var groups = _cats.GetFilterGroups();

            var allItems = (categories?.Any() == true)
                ? _products.GetByCategorySlugs(categories)
                : _products.GetAll();

            var items = allItems.Where(p => p.IsActive).ToList();

            var vm = new ShopViewModel
            {
                FilterGroups     = groups,
                ActiveCategories = categories ?? Enumerable.Empty<string>(),
                Products         = items
            };

            return View(vm);
        }
        #endregion
    }
}
