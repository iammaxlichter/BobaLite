// ───── Framework Usings ─────────────────────────────
using Microsoft.AspNetCore.Mvc;

namespace BobaLite.Controllers
{
    /// <summary>
    /// Handles requests for the FAQ (Frequently Asked Questions) page.
    /// </summary>
    public class FaqController : Controller
    {
        #region Constructor
        /// <summary>
        /// Initializes a new instance of the <see cref="FaqController"/> class.
        /// </summary>
        public FaqController()
        {
        }
        #endregion

        #region GET Methods
        /// <summary>
        /// Displays the FAQ page.
        /// </summary>
        [HttpGet("/FAQ")]
        public IActionResult Index()
        {
            return View(); // Renders Views/Faq/Index.cshtml
        }
        #endregion
    }
}
