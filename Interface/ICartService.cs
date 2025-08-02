// ───── Project Usings ───────────────────────────────
using BobaLite.DTOs;

namespace BobaLite.Services
{
    /// <summary>
    /// Interface for cart service operations.
    /// </summary>
    public interface ICartService
    {
        /// <summary>
        /// Retrieves the current cart.
        /// </summary>
        CartDto GetCart();

        /// <summary>
        /// Adds an item to the cart or updates its quantity if it already exists.
        /// Items are considered the same only if ProductId, Attribute, AND CustomText all match.
        /// </summary>
        /// <param name="productId">The product ID.</param>
        /// <param name="attribute">The product variant attribute.</param>
        /// <param name="quantity">The quantity to add.</param>
        /// <param name="customText">Optional custom text for personalization.</param>
        void AddItem(int productId, string attribute, int quantity = 1, string? customText = null);

        /// <summary>
        /// Updates the quantity of a specific item in the cart.
        /// Items are identified by ProductId, Attribute, AND CustomText.
        /// </summary>
        /// <param name="productId">The product ID.</param>
        /// <param name="attribute">The product variant attribute.</param>
        /// <param name="quantity">The new quantity.</param>
        /// <param name="customText">The custom text to identify the specific item.</param>
        void UpdateQuantity(int productId, string attribute, int quantity, string? customText = null);

        /// <summary>
        /// Removes a specific item from the cart.
        /// Items are identified by ProductId, Attribute, AND CustomText.
        /// </summary>
        /// <param name="productId">The product ID.</param>
        /// <param name="attribute">The product variant attribute.</param>
        /// <param name="customText">The custom text to identify the specific item.</param>
        void RemoveItem(int productId, string attribute, string? customText = null);

        /// <summary>
        /// Clears all items from the cart.
        /// </summary>
        void ClearCart();
    }
}