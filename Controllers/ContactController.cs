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
            return View();
        }

        // POST /Contact
        [HttpPost("/Contact")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index([FromForm] ContactForm form)
        {
            if (!ModelState.IsValid)
                return View(form);

            _logger.LogInformation("Received contact form: Name={Name}, Email={Email}", form.Name, form.Email);

            // build email content
            var subject = $"[BobaLite] New Contact from {form.Name}";

            var plain = new StringBuilder()
                .AppendLine($"Name:    {form.Name}")
                .AppendLine($"Email:   {form.Email}")
                .AppendLine()
                .AppendLine("Message:")
                .AppendLine(form.Message)
                .ToString();

            var html = new StringBuilder()
                .AppendLine("<h2>New Contact Form Submission</h2>")
                .AppendLine($"<p><strong>Name:</strong>  {form.Name}</p>")
                .AppendLine($"<p><strong>Email:</strong> {form.Email}</p>")
                .AppendLine("<p><strong>Message:</strong></p>")
                .AppendLine($"<p>{form.Message.Replace("\n", "<br/>")}</p>")
                .ToString();

            var client = new SendGridClient(_sendGridKey);
            var from   = new EmailAddress("iammaxlichter@gmail.com", "Max Lichter"); // your verified sender
            var to     = new EmailAddress("iammaxlichter@gmail.com");               // your inbox

            var msg = MailHelper.CreateSingleEmail(from, to, subject, plain, html);

            _logger.LogInformation("Sending via SendGrid...");
            var resp = await client.SendEmailAsync(msg);
            _logger.LogInformation("SendGrid status: {StatusCode}", resp.StatusCode);

            if (resp.StatusCode == HttpStatusCode.Accepted)
            {
                _logger.LogInformation("Contact email sent successfully.");
                ViewBag.Success = "Thanks! We got your message.";
                ModelState.Clear();
            }
            else
            {
                _logger.LogError("Failed to send contact email. Status: {StatusCode}", resp.StatusCode);
                ModelState.AddModelError("", "Oops—something went wrong. Please try again later.");
            }

            return View();
        }
    }
}
