namespace BobaLite.DTOs
{
    public class CartItemDto
    {
        public string  ProductName { get; set; } = "";
        public int ProductId { get; set; }
        public string? Attribute { get; set; }  // e.g. "1-pack", "XL", etc.
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string  ImageUrl   { get; set; } = "";
    }
}
