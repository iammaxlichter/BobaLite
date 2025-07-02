namespace BobaLite.Models
{
    public class ProductVariantImage
    {
        public int Id { get; set; }
        public int VariantId { get; set; }
        public ProductVariant Variant { get; set; } = null!;
        public string Url { get; set; } = "";
        public int SortOrder { get; set; }
    }
}
