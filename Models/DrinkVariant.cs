namespace BobaLite.Models
{
    public class DrinkVariant
    {
        public int Id { get; set; }
        public string Name { get; set; } = ""; // e.g., "Single Can", "6 Pack", "12 Pack"
        public decimal Price { get; set; }
        public int Quantity { get; set; } // e.g., 1, 6, 12

        public int DrinkId { get; set; }
        public Drink Drink { get; set; } = null!;
    }
}
