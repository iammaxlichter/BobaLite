// ───── Framework Usings ─────────────────────────────
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text;
using System.Threading.Tasks;

// ───── External Usings ──────────────────────────────
using SendGrid;
using SendGrid.Helpers.Mail;

// ───── Project Usings ───────────────────────────────
using BobaLite.Models;

namespace BobaLite.Controllers
{
    public class ContactController : Controller
    {
        private readonly string? _sendGridKey;
        private readonly ILogger<ContactController> _logger;

        #region Constructor
        /// <summary>
        /// Initializes a new instance of the <see cref="ContactController"/> class.
        /// </summary>
        public ContactController(IConfiguration config, ILogger<ContactController> logger)
        {
            _sendGridKey = config["SENDGRID_APIKEY"];
            _logger = logger;
        }
        #endregion

        #region GET Methods
        /// <summary>
        /// Displays the contact form page.
        /// </summary>
        [HttpGet("/Contact")]
        public IActionResult Index()
        {
            // Show one-time success message if present
            if (TempData["Success"] is string msg)
                ViewBag.Success = msg;

            return View();
        }
        #endregion

        #region POST Methods
        /// <summary>
        /// Processes the contact form submission and sends an email via SendGrid.
        /// </summary>
        [HttpPost("/Contact")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index([FromForm] ContactForm form)
        {
            if (!ModelState.IsValid)
                return View(form);

            if (string.IsNullOrEmpty(_sendGridKey))
            {
                _logger.LogError("SendGrid API key is not configured");
                ModelState.AddModelError(string.Empty, "Email service is not properly configured. Please contact the administrator.");
                return View(form);
            }

            _logger.LogInformation("Received contact form submission from {Email} ({Name})", form.Email, form.Name);

            var subject = $"[BobaLite] New Contact from {form.Name}";
            var plainBody = BuildPlainTextBody(form);
            var htmlBody = BuildHtmlBody(form);

            var client = new SendGridClient(_sendGridKey);
            var from = new EmailAddress("drinkbobalite@gmail.com", "BobaLite");
            var to = new EmailAddress("drinkbobalite@gmail.com");
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainBody, htmlBody);

            _logger.LogInformation("Sending email via SendGrid...");
            var resp = await client.SendEmailAsync(msg);
            _logger.LogInformation("SendGrid responded with {StatusCode}", resp.StatusCode);

            if (resp.StatusCode == HttpStatusCode.Accepted)
            {
                _logger.LogInformation("Contact email sent successfully.");
                TempData["Success"] = "Thanks! We got your message.";
                return RedirectToAction(nameof(Index));
            }

            _logger.LogError("Failed to send contact email. Status: {StatusCode}", resp.StatusCode);
            ModelState.AddModelError(string.Empty, "Oops—something went wrong. Please try again later.");
            return View(form);
        }
        #endregion

        #region Private Helpers
        /// <summary>
        /// Builds the plaintext email body for the contact submission.
        /// </summary>
        private string BuildPlainTextBody(ContactForm form)
        {
            return new StringBuilder()
                .AppendLine($"Name: {form.Name}")
                .AppendLine($"Email: {form.Email}")
                .AppendLine()
                .AppendLine("Message:")
                .AppendLine(form.Message)
                .ToString();
        }

        /// <summary>
        /// Builds the HTML email body for the contact submission.
        /// </summary>
        private string BuildHtmlBody(ContactForm form)
        {
            return new StringBuilder()
                .AppendLine("<h2>New Contact Form Submission</h2>")
                .AppendLine($"<p><strong>Name:</strong> {form.Name}</p>")
                .AppendLine($"<p><strong>Email:</strong> {form.Email}</p>")
                .AppendLine("<p><strong>Message:</strong></p>")
                .AppendLine($"<p>{form.Message.Replace("\n", "<br/>")}</p>")
                .ToString();
        }
        #endregion
    }
}