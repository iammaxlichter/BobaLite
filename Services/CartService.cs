// ───── Framework Usings ─────────────────────────────
using System;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

// ───── Project Usings ───────────────────────────────
using BobaLite.DTOs;
using BobaLite.Data;

namespace BobaLite.Services
{
    /// <summary>
    /// Service for managing the shopping cart. Handles adding, updating, 
    /// removing, and retrieving cart items from session storage.
    /// </summary>
    public class CartService : ICartService
    {
        private readonly IHttpContextAccessor _http;
        private readonly IProductRepository _repo;
        private const string SessionKey = "Cart";

        /// <summary>
        /// Initializes a new instance of the <see cref="CartService"/> class.
        /// </summary>
        /// <param name="http">The HTTP context accessor for session management.</param>
        /// <param name="repo">The product repository for retrieving product and variant details.</param>
        public CartService(IHttpContextAccessor http, IProductRepository repo)
        {
            _http = http;
            _repo = repo;
        }

        /// <summary>
        /// Gets the current session's cart.
        /// </summary>
        private ISession Session => _http.HttpContext?.Session ?? throw new InvalidOperationException("HttpContext or Session is not available");

        /// <summary>
        /// Retrieves the current cart and refreshes item details (price, images, stock).
        /// </summary>
        public CartDto GetCart()
        {
            var json = Session.GetString(SessionKey);
            var dto = string.IsNullOrEmpty(json)
                ? new CartDto()
                : JsonSerializer.Deserialize<CartDto>(json) ?? new CartDto();

            // Rehydrate prices and images, clamp stock
            foreach (var item in dto.Items)
            {
                if (string.IsNullOrEmpty(item.Attribute))
                    continue;

                var v = _repo.GetVariant(item.ProductId, item.Attribute)
                    ?? throw new Exception("Variant not found");
                item.VariantId   = v.Id; 
                item.UnitPrice = v.Price;
                item.ImageUrl = v.PrimaryImageUrl;
            }

            dto.Items = dto.Items
                .Where(i => !string.IsNullOrEmpty(i.Attribute))
                .Select(i =>
                {
                    var variant = _repo.GetVariant(i.ProductId, i.Attribute!);
                    if (variant != null)
                    {
                        i.Quantity = Math.Min(i.Quantity, variant.Stock);
                    }
                    return i;
                })
                .ToList();

            return dto;
        }

        /// <summary>
        /// Adds an item to the cart or updates its quantity if it already exists.
        /// Items are considered the same only if ProductId, Attribute, AND CustomText all match.
        /// </summary>
        /// <param name="productId">The product ID.</param>
        /// <param name="attribute">The product variant attribute (e.g., "1-pack").</param>
        /// <param name="quantity">The quantity to add.</param>
        /// <param name="customText">Optional custom text (e.g., for personalization).</param>
        public void AddItem(int productId, string attribute, int quantity = 1, string? customText = null)
        {
            if (string.IsNullOrEmpty(attribute))
                throw new ArgumentException("Attribute cannot be null or empty", nameof(attribute));

            var cart = GetCart();

            var existing = cart.Items
                .FirstOrDefault(i =>
                    i.ProductId == productId &&
                    i.Attribute == attribute &&
                    string.Equals(i.CustomText, customText, StringComparison.Ordinal));

            var variant = _repo.GetVariant(productId, attribute)
                ?? throw new Exception("Variant not found");
            var product = _repo.GetProduct(productId)
                ?? throw new Exception("Product not found");

            var maxStock = variant.Stock;
            var unitPrice = variant.Price;
            var imgUrl = variant.PrimaryImageUrl;
            var productName = product.Name;

            if (existing == null)
            {
                var qtyToAdd = Math.Min(quantity, maxStock);
                cart.Items.Add(new CartItemDto
                {
                    ProductId = productId,
                    VariantId   = variant.Id,
                    Attribute = attribute,
                    Quantity = qtyToAdd,
                    UnitPrice = unitPrice,
                    ImageUrl = imgUrl,
                    ProductName = productName,
                    CustomText = customText
                });
            }
            else
            {
                existing.Quantity = Math.Min(existing.Quantity + quantity, maxStock);
            }

            Save(cart);
        }

        /// <summary>
        /// Updates the quantity of a specific item in the cart.
        /// Items are identified by ProductId, Attribute, AND CustomText.
        /// </summary>
        public void UpdateQuantity(int productId, string attribute, int quantity, string? customText = null)
        {
            if (string.IsNullOrEmpty(attribute))
                throw new ArgumentException("Attribute cannot be null or empty", nameof(attribute));

            var cart = GetCart();
            var item = cart.Items
                .FirstOrDefault(i =>
                    i.ProductId == productId &&
                    i.Attribute == attribute &&
                    string.Equals(i.CustomText, customText, StringComparison.Ordinal));

            if (item == null) return;

            if (quantity < 1)
            {
                cart.Items.Remove(item);
            }
            else
            {
                var variant = _repo.GetVariant(productId, attribute)
                    ?? throw new Exception("Variant not found");
                item.Quantity = Math.Min(quantity, variant.Stock);
            }

            Save(cart);
        }

        /// <summary>
        /// Removes a specific item from the cart.
        /// Items are identified by ProductId, Attribute, AND CustomText.
        /// </summary>
        public void RemoveItem(int productId, string attribute, string? customText = null)
        {
            if (string.IsNullOrEmpty(attribute))
                throw new ArgumentException("Attribute cannot be null or empty", nameof(attribute));

            var cart = GetCart();
            cart.Items.RemoveAll(i =>
                i.ProductId == productId &&
                i.Attribute == attribute &&
                string.Equals(i.CustomText, customText, StringComparison.Ordinal));
            Save(cart);
        }

        /// <summary>
        /// Clears the cart.
        /// </summary>
        public void ClearCart()
        {
            var empty = new CartDto();
            Save(empty);
        }

        /// <summary>
        /// Saves the current cart state to the session.
        /// </summary>
        private void Save(CartDto cart)
        {
            Session.SetString(SessionKey, JsonSerializer.Serialize(cart));
        }
    }
}
