// ───── Framework Usings ─────────────────────────────
using Microsoft.AspNetCore.Mvc;
using System.Linq;

// ───── Project Usings ───────────────────────────────
using BobaLite.Data;
using BobaLite.Models;

namespace BobaLite.Controllers
{
    /// <summary>
    /// Handles requests related to products and product details.
    /// </summary>
    public class ProductController : Controller
    {
        private readonly IProductRepository _repo;

        #region Constructor
        /// <summary>
        /// Initializes a new instance of the <see cref="ProductController"/> class.
        /// </summary>
        public ProductController(IProductRepository repo)
        {
            _repo = repo;
        }
        #endregion

        #region GET Methods
        /// <summary>
        /// Displays the product details page.
        /// </summary>
        /// <param name="id">The product ID.</param>
        [HttpGet]
        public IActionResult Details(int? id)
        {
            if (id == null)
                return NotFound();

            var product = _repo.GetProduct(id.Value);

            if (product == null)
                return NotFound();

            // Check if product belongs to "create-my-cans" category
            var hasCreateMyCansCategory = product.ProductCategories?
                .Any(pc => pc.Category?.Slug == "create-my-cans") ?? false;

            ViewData["ShowCustomText"] = hasCreateMyCansCategory;

            return View("Views/Pdp/Index.cshtml", product);
        }

        /// <summary>
        /// Returns a list of product names for search functionality.
        /// </summary>
        [HttpGet("/api/products/search")]
        public IActionResult GetAllProductNames()
        {
            var results = _repo.GetSearchResults();
            return Ok(results);
        }
        #endregion
    }
}
