namespace BobaLite.Models
{
    public class Drink
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";

        // Variants
        public List<DrinkVariant> Variants { get; set; } = new();
    }
}