using Microsoft.AspNetCore.Mvc;

namespace BobaLite.Controllers
{
    public class CareersController : Controller
    {
        [HttpGet("/Careers")]
        public IActionResult Index()
        {
            return View(); // Looks for Views/Careers/Index.cshtml
        }
    }
}
