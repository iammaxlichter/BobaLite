namespace BobaLite.DTOs
{
    public class CheckoutOrderDto
    {
        public List<CheckoutCartItemDto>   Items            { get; set; }
        public CheckoutAddressDto         ShippingAddress  { get; set; }  // ← was “Billing”
        public CheckoutAddressDto         BillingAddress   { get; set; }  // ← new
        public CheckoutPaymentDto         Payment          { get; set; }
    }

    public class CheckoutCartItemDto
    {
        public int VariantId { get; set; }
        public string Attribute { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public string? ProductName { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class CheckoutAddressDto
    {
        public string FullName   { get; set; }
        public string Address1   { get; set; }
        public string Address2   { get; set; }
        public string Phone { get; set; }       
         public string City { get; set; }
        public string State      { get; set; }
        public string PostalCode { get; set; }
        public string Email      { get; set; }
    }

    public class CheckoutPaymentDto
    {
        public string CardNumber { get; set; }
        public string Expiry     { get; set; }
        public string Cvc        { get; set; }
    }
}
