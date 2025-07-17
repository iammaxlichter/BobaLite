using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using BobaLite.Models;

namespace BobaLite.Controllers
{
    public class ContactController : Controller
    {
        private readonly string _sendGridKey;
        private readonly ILogger<ContactController> _logger;

        public ContactController(IConfiguration config, ILogger<ContactController> logger)
        {
            _sendGridKey = config["SENDGRID_APIKEY"];
            _logger      = logger;
        }

        // GET /Contact
        [HttpGet("/Contact")]
        public IActionResult Index()
        {
            // Show one‑time success message if present
            if (TempData["Success"] is string msg)
            {
                ViewBag.Success = msg;
            }
            return View();
        }

        // POST /Contact
        [HttpPost("/Contact")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index([FromForm] ContactForm form)
        {
            if (!ModelState.IsValid)
                return View(form);

            _logger.LogInformation("Received contact form submission from {Email} ({Name})",
                form.Email, form.Name);

            // Build the plaintext and HTML bodies
            var subject = $"[BobaLite] New Contact from {form.Name}";
            var plain = new StringBuilder()
                .AppendLine($"Name: {form.Name}")
                .AppendLine($"Email: {form.Email}")
                .AppendLine()
                .AppendLine("Message:")
                .AppendLine(form.Message)
                .ToString();

            var html = new StringBuilder()
                .AppendLine("<h2>New Contact Form Submission</h2>")
                .AppendLine($"<p><strong>Name:</strong> {form.Name}</p>")
                .AppendLine($"<p><strong>Email:</strong> {form.Email}</p>")
                .AppendLine("<p><strong>Message:</strong></p>")
                .AppendLine($"<p>{form.Message.Replace("\n", "<br/>")}</p>")
                .ToString();

            // Send with SendGrid
            var client = new SendGridClient(_sendGridKey);
            var from   = new EmailAddress("iammaxlichter@gmail.com", "BobaLite");
            var to     = new EmailAddress("iammaxlichter@gmail.com");
            var msg    = MailHelper.CreateSingleEmail(from, to, subject, plain, html);

            _logger.LogInformation("Sending email via SendGrid...");
            var resp = await client.SendEmailAsync(msg);
            _logger.LogInformation("SendGrid responded with {StatusCode}", resp.StatusCode);

            if (resp.StatusCode == HttpStatusCode.Accepted)
            {
                _logger.LogInformation("Contact email sent successfully.");
                // Store success message, then redirect (Post‑Redirect‑Get)
                TempData["Success"] = "Thanks! We got your message.";
                return RedirectToAction(nameof(Index));
            }
            else
            {
                _logger.LogError("Failed to send contact email. Status: {StatusCode}",
                    resp.StatusCode);
                ModelState.AddModelError(string.Empty,
                    "Oops—something went wrong. Please try again later.");
                return View(form);
            }
        }
    }
}
