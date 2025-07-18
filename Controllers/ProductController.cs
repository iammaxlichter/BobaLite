using Microsoft.AspNetCore.Mvc;
using BobaLite.Data;

namespace BobaLite.Controllers
{
    public class ProductController : Controller
    {
        private readonly IProductRepository _repo;
        public ProductController(IProductRepository repo) => _repo = repo;

        [HttpGet]
        public IActionResult Details(int? id)
        {
            if (id == null)
                return NotFound();

            var product = _repo.GetProduct(id.Value);
            if (product == null)
                return NotFound();

            return View("Views/Pdp/Index.cshtml", product);
        }

        [HttpGet("/api/products/search")]
        public IActionResult GetAllProductNames()
        {
            var results = _repo.GetSearchResults();
            return Ok(results);
        }

    }
}
