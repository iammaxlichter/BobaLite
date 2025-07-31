// ───── Project Usings ───────────────────────────────
namespace BobaLite.DTOs
{
    /// <summary>
    /// Represents a single item in the shopping cart.
    /// </summary>
    public class CartItemDto
    {
        public string ProductName { get; set; } = string.Empty;
        public int ProductId { get; set; }
        public string? Attribute { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? CustomText { get; set; }
    }
}
