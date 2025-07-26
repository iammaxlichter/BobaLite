using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace BobaLite.Services
{
    public class EmailService : IEmailService
    {
        private readonly string _apiKey;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _apiKey = config["SENDGRID_APIKEY"];
            _logger = logger;
        }

        public async Task SendOrderConfirmationEmailAsync(string toEmail, string toName, string htmlBody, string subject)
        {
            var client = new SendGridClient(_apiKey);
            var from = new EmailAddress("iammaxlichter@gmail.com", "BobaLite");
            var to = new EmailAddress(toEmail, toName);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, "", htmlBody);

            _logger.LogInformation("Sending order confirmation to {Email}", toEmail);
            var response = await client.SendEmailAsync(msg);
            _logger.LogInformation("Email sent. Status: {StatusCode}", response.StatusCode);
        }
    }
}
