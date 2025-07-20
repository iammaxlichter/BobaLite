using System;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using BobaLite.DTOs;
using BobaLite.Data;    // IProductRepository

namespace BobaLite.Services
{
    public class CartService : ICartService
    {
        private readonly IHttpContextAccessor _http;
        private readonly IProductRepository   _repo;
        private const string SessionKey = "Cart";

        public CartService(IHttpContextAccessor http, IProductRepository repo)
        {
            _http  = http;
            _repo  = repo;
        }

        private ISession Session => _http.HttpContext.Session;

        public CartDto GetCart()
        {
            var json = Session.GetString(SessionKey);
            var dto  = string.IsNullOrEmpty(json)
                       ? new CartDto()
                       : JsonSerializer.Deserialize<CartDto>(json)!;

            // rehydrate prices + images, clamp stock
            foreach (var item in dto.Items)
            {
                var v = _repo.GetVariant(item.ProductId, item.Attribute)
                          ?? throw new Exception("Variant not found");
                item.UnitPrice = v.Price;
                item.ImageUrl  = v.PrimaryImageUrl;
            }

            dto.Items = dto.Items
                       .Select(i =>
                       {
                           i.Quantity = Math.Min(i.Quantity,
                                       _repo.GetVariant(i.ProductId, i.Attribute).Stock);
                           return i;
                       })
                       .ToList();

            return dto;
        }

        public void AddItem(int productId, string attribute, int quantity = 1)
        {
            var cart     = GetCart();
            var existing = cart.Items
                               .FirstOrDefault(i => i.ProductId == productId
                                                 && i.Attribute == attribute);

            var variant = _repo.GetVariant(productId, attribute)
                           ?? throw new Exception("Variant not found");
            var product = _repo.GetProduct(productId)
                           ?? throw new Exception("Product not found");

            var maxStock    = variant.Stock;
            var unitPrice   = variant.Price;
            var imgUrl      = variant.PrimaryImageUrl;
            var productName = product.Name;

            if (existing == null)
            {
                var qtyToAdd = Math.Min(quantity, maxStock);
                cart.Items.Add(new CartItemDto
                {
                    ProductId   = productId,
                    Attribute   = attribute,
                    Quantity    = qtyToAdd,
                    UnitPrice   = unitPrice,
                    ImageUrl    = imgUrl,
                    ProductName = productName
                });
            }
            else
            {
                existing.Quantity = Math.Min(existing.Quantity + quantity, maxStock);
            }

            Save(cart);
        }

        public void UpdateQuantity(int productId, string attribute, int quantity)
        {
            var cart = GetCart();
            var item = cart.Items
                           .FirstOrDefault(i => i.ProductId == productId
                                             && i.Attribute == attribute);
            if (item == null) return;

            if (quantity < 1)
                cart.Items.Remove(item);
            else
            {
                var variant = _repo.GetVariant(productId, attribute)
                              ?? throw new Exception("Variant not found");
                item.Quantity = Math.Min(quantity, variant.Stock);
            }

            Save(cart);
        }

        public void RemoveItem(int productId, string attribute)
        {
            var cart = GetCart();
            cart.Items.RemoveAll(i =>
                i.ProductId == productId && i.Attribute == attribute);
            Save(cart);
        }
        public void ClearCart()
        {
            var empty = new CartDto(); 
            Save(empty);
        }

        private void Save(CartDto cart)
        {
            Session.SetString(SessionKey,
                JsonSerializer.Serialize(cart));
        }
    }
}
