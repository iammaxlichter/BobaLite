// ───── Framework Usings ─────────────────────────────
using Microsoft.AspNetCore.Mvc;

namespace BobaLite.Controllers
{
    /// <summary>
    /// Handles requests for the Careers page.
    /// </summary>
    public class CareersController : Controller
    {
        #region Constructor
        /// <summary>
        /// Initializes a new instance of the <see cref="CareersController"/> class.
        /// </summary>
        public CareersController()
        {
        }
        #endregion

        #region GET Methods

        /// <summary>
        /// Displays the Careers page.
        /// </summary>
        [HttpGet("/Careers")]
        public IActionResult Index()
        {
            return View(); // Renders Views/Careers/Index.cshtml
        }

        #endregion

        #region POST Methods
        // (No POST methods for this controller yet)
        #endregion
    }
}
