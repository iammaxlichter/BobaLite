// Models/ProductVariant.cs
namespace BobaLite.Models
{
    public class ProductVariant
    {
        public int     Id         { get; set; }
        public decimal Price      { get; set; }
        public int     Stock      { get; set; }
        public string? Attributes { get; set; }           // e.g. “12-pack”, “Size L / Red”

        // FK back to Product
        public int     ProductId  { get; set; }
        
        public string ImageUrl   { get; set; } = "";

        public Product Product { get; set; } = null!;
    }
}
