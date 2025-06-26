using Microsoft.AspNetCore.Mvc;

namespace BobaLite.Controllers
{
    public class HomeController : Controller
    {
        // Displays the Home page
        public IActionResult Index()
        {
            return View();
        }
    }
}
