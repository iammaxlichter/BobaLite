// ───── Framework Usings ─────────────────────────────
using System.Collections.Generic;
using System.Linq;

// ───── Project Usings ───────────────────────────────
namespace BobaLite.DTOs
{
    /// <summary>
    /// Represents the shopping cart, including its items and the computed grand total.
    /// </summary>
    public class CartDto
    {
        /// <summary>
        /// The items currently in the cart.
        /// </summary>
        public List<CartItemDto> Items { get; set; } = new();

        /// <summary>
        /// The total price of all items in the cart.
        /// </summary>
        public decimal GrandTotal => Items.Sum(i => i.UnitPrice * i.Quantity);
    }
}
