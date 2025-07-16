using Microsoft.AspNetCore.Mvc;

namespace BobaLite.Controllers
{
    public class FaqController : Controller
    {
        [HttpGet("/FAQ")]
        public IActionResult Index()
        {
            return View(); 
        }
    }
}
