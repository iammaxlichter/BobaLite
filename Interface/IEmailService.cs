// ───── Framework Usings ─────────────────────────────
using System.Threading.Tasks;

namespace BobaLite.Services
{
    /// <summary>
    /// Defines email-related operations for the application.
    /// </summary>
    public interface IEmailService
    {
        /// <summary>
        /// Sends an order confirmation email to a customer.
        /// </summary>
        /// <param name="toEmail">The recipient's email address.</param>
        /// <param name="toName">The recipient's name.</param>
        /// <param name="htmlBody">The HTML content of the email.</param>
        /// <param name="subject">The subject of the email.</param>
        Task SendOrderConfirmationEmailAsync(string toEmail, string toName, string htmlBody, string subject);
    }
}
