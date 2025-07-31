// ───── Framework Usings ─────────────────────────────
using Microsoft.AspNetCore.Mvc;

namespace BobaLite.Controllers
{
    /// <summary>
    /// Handles requests for the About page.
    /// </summary>
    public class AboutController : Controller
    {
        #region Constructor
        /// <summary>
        /// Initializes a new instance of the <see cref="AboutController"/> class.
        /// </summary>
        public AboutController()
        {
        }
        #endregion

        #region GET Methods

        /// <summary>
        /// Displays the About page.
        /// </summary>
        [HttpGet("/About")]
        public IActionResult Index()
        {
            return View(); // Renders Views/About/Index.cshtml
        }

        #endregion

        #region POST Methods
        // (No POST methods for this controller yet)
        #endregion
    }
}
