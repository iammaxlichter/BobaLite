// Models/Product.cs
namespace BobaLite.Models
{
    public class Product
    {
        public int    Id          { get; set; }
        public string Name        { get; set; } = "";
        public string? Description { get; set; }
        public string  Type        { get; set; } = "";    // e.g. “Drink”, “Shirt”, “Knickknack”

        // navigation to all variants of this product
        public List<ProductVariant> Variants { get; set; } = new();
    }
}
