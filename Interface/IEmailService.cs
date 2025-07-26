namespace BobaLite.Services
{
    public interface IEmailService
    {
        Task SendOrderConfirmationEmailAsync(string toEmail, string toName, string htmlBody, string subject);
    }
}
