using BobaLite.Models;

namespace BobaLite.Data
{
    public static class DataSeeder
    {
        public static void Seed(AppDbContext context)
        {
            if (!context.Drinks.Any())
            {
                var drink1 = new Drink { Name = "Classic Milk Tea" };
                var drink2 = new Drink { Name = "Taro Milk Tea" };
                var drink3 = new Drink { Name = "Mango Green Tea" };

                context.Drinks.AddRange(drink1, drink2, drink3);
                context.SaveChanges();

                var variants = new List<DrinkVariant>
                {
                    new() { Name = "Single Can", Price = 3.99m, Quantity = 1, DrinkId = drink1.Id },
                    new() { Name = "6 Pack", Price = 21.99m, Quantity = 6, DrinkId = drink1.Id },
                    new() { Name = "12 Pack", Price = 39.99m, Quantity = 12, DrinkId = drink1.Id },

                    new() { Name = "Single Can", Price = 4.29m, Quantity = 1, DrinkId = drink2.Id },
                    new() { Name = "6 Pack", Price = 24.99m, Quantity = 6, DrinkId = drink2.Id },
                    new() { Name = "12 Pack", Price = 44.99m, Quantity = 12, DrinkId = drink2.Id },

                    new() { Name = "Single Can", Price = 3.59m, Quantity = 1, DrinkId = drink3.Id },
                    new() { Name = "6 Pack", Price = 20.99m, Quantity = 6, DrinkId = drink3.Id },
                    new() { Name = "12 Pack", Price = 38.99m, Quantity = 12, DrinkId = drink3.Id }
                };

                context.DrinkVariants.AddRange(variants);
                context.SaveChanges();
            }
        }
    }
}
