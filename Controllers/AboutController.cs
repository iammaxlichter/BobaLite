using Microsoft.AspNetCore.Mvc;

namespace BobaLite.Controllers
{
    public class AboutController : Controller
    {
        [HttpGet("/About")]
        public IActionResult Index()
        {
            return View(); // Looks for Views/About/Index.cshtml
        }
    }
}
