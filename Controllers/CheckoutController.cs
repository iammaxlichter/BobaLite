// ───── Framework Usings ─────────────────────────────
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

// ───── Project Usings ───────────────────────────────
using BobaLite.DTOs;
using BobaLite.Data;
using BobaLite.Services;

namespace BobaLite.Controllers
{
    [ApiController]
    public class CheckoutController : Controller
    {
        private readonly AppDbContext _db;
        private readonly ILogger<CheckoutController> _logger;
        private readonly IEmailService _email;

        #region Constructor
        /// <summary>
        /// Initializes a new instance of the <see cref="CheckoutController"/> class.
        /// </summary>
        public CheckoutController(AppDbContext db, ILogger<CheckoutController> logger, IEmailService email)
        {
            _db = db;
            _logger = logger;
            _email = email;
        }
        #endregion

        #region GET Methods
        /// <summary>
        /// Displays the checkout page.
        /// </summary>
        [HttpGet("/Checkout")]
        public IActionResult Index() => View();
        #endregion

        #region POST Methods
        /// <summary>
        /// Processes an order, updates stock, and sends a confirmation email.
        /// </summary>
        [HttpPost("/api/checkout")]
        public async Task<IActionResult> PlaceOrder([FromBody] CheckoutOrderDto order)
        {
            _logger.LogInformation("Received order: {@Order}", order);

            // ─── Update stock levels ──────────────────────────
            foreach (var item in order.Items)
            {
                var variant = _db.Variants.Find(item.VariantId);
                if (variant != null)
                    variant.Stock = Math.Max(0, variant.Stock - item.Quantity);
            }
            _db.SaveChanges();

            // ─── Build and send confirmation email ─────────────
            try
            {
                string html = BuildConfirmationEmail(order);
                string subject = "Your BobaLite Order Confirmation";
                string recipient = order.ShippingAddress.Email;
                string name = order.ShippingAddress.FullName;

                await _email.SendOrderConfirmationEmailAsync(recipient, name, html, subject);
                _logger.LogInformation("Order confirmation email sent to {Email}", recipient);

                await _email.SendOrderConfirmationEmailAsync("drinkbobalite@gmail.com", "BobaLite Admin", html, $"[Copy] {subject}");
                _logger.LogInformation("Order copy email sent to admin");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send confirmation email");
            }

            return Ok(new { success = true });
        }
        #endregion

        #region Private Helpers
        /// <summary>
        /// Builds the HTML body for the order confirmation email.
        /// </summary>
        private string BuildConfirmationEmail(CheckoutOrderDto order)
        {
            var sb = new System.Text.StringBuilder();

            sb.AppendLine("<h2>Thanks for your order!</h2>");
            sb.AppendLine("<h3>Order Summary</h3><ul>");
            foreach (var item in order.Items)
            {
                var label = !string.IsNullOrWhiteSpace(item.ProductName)
                    ? $"{item.ProductName} ({item.Attribute})"
                    : item.Attribute;

                sb.AppendLine("<li style='margin-bottom:10px;'>");
                sb.AppendLine($"{item.Quantity} x {label} — ${item.Price * item.Quantity:F2}</li>");
            }
            sb.AppendLine("</ul>");

            sb.AppendLine("<h3>Shipping Address</h3>");
            sb.AppendLine($"<p>{order.ShippingAddress.FullName}<br/>");
            sb.AppendLine($"{order.ShippingAddress.Address1}<br/>");
            if (!string.IsNullOrEmpty(order.ShippingAddress.Address2))
                sb.AppendLine($"{order.ShippingAddress.Address2}<br/>");
            sb.AppendLine($"{order.ShippingAddress.City}, {order.ShippingAddress.State} {order.ShippingAddress.PostalCode}<br/>");
            sb.AppendLine($"{order.ShippingAddress.Phone}<br/>");
            sb.AppendLine($"{order.ShippingAddress.Email}</p>");

            if (order.BillingAddress != null && order.BillingAddress.Email != order.ShippingAddress.Email)
            {
                sb.AppendLine("<h3>Billing Address</h3>");
                sb.AppendLine($"<p>{order.BillingAddress.FullName}<br/>");
                sb.AppendLine($"{order.BillingAddress.Address1}<br/>");
                if (!string.IsNullOrEmpty(order.BillingAddress.Address2))
                    sb.AppendLine($"{order.BillingAddress.Address2}<br/>");
                sb.AppendLine($"{order.BillingAddress.City}, {order.BillingAddress.State} {order.BillingAddress.PostalCode}<br/>");
                sb.AppendLine($"{order.BillingAddress.Phone}<br/>");
                sb.AppendLine($"{order.BillingAddress.Email}</p>");
            }

            sb.AppendLine("<h3>Payment</h3>");
            var last4 = order.Payment.CardNumber?.Replace(" ", "").TakeLast(4).ToArray();
            sb.AppendLine($"<p>Card ending in **** {(last4 != null ? new string(last4) : "----")}<br/>");
            sb.AppendLine($"Expires: {order.Payment.Expiry}</p>");

            double total = order.Items.Sum(i => i.Quantity * i.Price);
            sb.AppendLine($"<h3>Total: ${total:F2}</h3>");

            return sb.ToString();
        }
        #endregion
    }
}
