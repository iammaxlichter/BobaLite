// ViewModels/ShopViewModel.cs
using System.Collections.Generic;
using BobaLite.DTOs;
using BobaLite.Models;

namespace BobaLite.ViewModels
{
    public class ShopViewModel
    {
        public IEnumerable<FilterGroupDto> FilterGroups     { get; set; } = null!;
        public IEnumerable<string>         ActiveCategories { get; set; } = null!;
        public IEnumerable<Product>        Products         { get; set; } = null!;
    }
}
