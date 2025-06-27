namespace BobaLite.Models
{
    public class DrinkVariant
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public int DrinkId { get; set; }
        public int Stock { get; set; }
        public Drink Drink { get; set; } = null!;
    }
}
