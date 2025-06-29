using System.Collections.Generic;
using System.Linq;

namespace BobaLite.DTOs
{
    public class CartDto
    {
        public List<CartItemDto> Items { get; set; } = new();
        public decimal GrandTotal => Items.Sum(i => i.UnitPrice * i.Quantity);
    }
}
