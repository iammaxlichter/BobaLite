// ───── Project Usings ───────────────────────────────
namespace BobaLite.DTOs
{
    /// <summary>
    /// Represents the full checkout order payload including items, addresses, and payment details.
    /// </summary>
    public class CheckoutOrderDto
    {
        public List<CheckoutCartItemDto> Items { get; set; } = new();
        public CheckoutAddressDto ShippingAddress { get; set; } = new();
        public CheckoutAddressDto BillingAddress { get; set; } = new();
        public CheckoutPaymentDto Payment { get; set; } = new();
    }

    /// <summary>
    /// Represents a single item in a checkout order.
    /// </summary>
    public class CheckoutCartItemDto
    {
        public int VariantId { get; set; }
        public string Attribute { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public double Price { get; set; }
        public string? ProductName { get; set; }
        public string? ImageUrl { get; set; }
    }

    /// <summary>
    /// Represents an address used during checkout (billing or shipping).
    /// </summary>
    public class CheckoutAddressDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Address1 { get; set; } = string.Empty;
        public string Address2 { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    /// <summary>
    /// Represents payment details for a checkout order.
    /// </summary>
    public class CheckoutPaymentDto
    {
        public string CardNumber { get; set; } = string.Empty;
        public string Expiry { get; set; } = string.Empty;
        public string Cvc { get; set; } = string.Empty;
    }
}
