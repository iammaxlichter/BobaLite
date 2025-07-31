// ───── Framework Usings ─────────────────────────────
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

// ───── Third-Party Usings ───────────────────────────
using SendGrid;
using SendGrid.Helpers.Mail;

namespace BobaLite.Services
{
    /// <summary>
    /// Service for sending transactional emails such as order confirmations.
    /// </summary>
    public class EmailService : IEmailService
    {
        private readonly string _apiKey;
        private readonly ILogger<EmailService> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="EmailService"/> class.
        /// </summary>
        /// <param name="config">The application configuration used to retrieve the SendGrid API key.</param>
        /// <param name="logger">The logger for recording email activity.</param>
        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _apiKey = config["SENDGRID_APIKEY"];
            _logger = logger;
        }

        /// <summary>
        /// Sends an order confirmation email asynchronously.
        /// </summary>
        /// <param name="toEmail">The recipient's email address.</param>
        /// <param name="toName">The recipient's name.</param>
        /// <param name="htmlBody">The HTML content of the email.</param>
        /// <param name="subject">The subject of the email.</param>
        public async Task SendOrderConfirmationEmailAsync(string toEmail, string toName, string htmlBody, string subject)
        {
            var client = new SendGridClient(_apiKey);
            var from = new EmailAddress("iammaxlichter@gmail.com", "BobaLite");
            var to = new EmailAddress(toEmail, toName);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, string.Empty, htmlBody);

            _logger.LogInformation("Sending order confirmation to {Email}", toEmail);
            var response = await client.SendEmailAsync(msg);
            _logger.LogInformation("Email sent. Status: {StatusCode}", response.StatusCode);
        }
    }
}
