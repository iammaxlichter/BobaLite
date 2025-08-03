// ───── Framework Usings ─────────────────────────────
using Microsoft.AspNetCore.Mvc;

namespace BobaLite.Controllers
{
    /// <summary>
    /// Handles requests for the Home page.
    /// </summary>
    public class HomeController : Controller
    {
        #region Constructor
        /// <summary>
        /// Initializes a new instance of the <see cref="HomeController"/> class.
        /// </summary>
        public HomeController()
        {
        }
        #endregion

        #region GET Methods
        /// <summary>
        /// Displays the Home page.
        /// </summary>
        public IActionResult Index()
        {
            return View(); // Renders Views/Home/Index.cshtml
        }
        #endregion
    }
}
