// ───── Project Usings ───────────────────────────────
using BobaLite.DTOs;

namespace BobaLite.Services
{
    /// <summary>
    /// Defines operations for managing the shopping cart.
    /// </summary>
    public interface ICartService
    {
        /// <summary>
        /// Retrieves the current cart with all items and updated pricing.
        /// </summary>
        /// <returns>The current <see cref="CartDto"/>.</returns>
        CartDto GetCart();

        /// <summary>
        /// Adds an item to the cart.
        /// </summary>
        /// <param name="productId">The ID of the product to add.</param>
        /// <param name="attribute">The variant attribute (e.g. "1-pack").</param>
        /// <param name="quantity">The quantity to add.</param>
        /// <param name="customText">Optional custom text (e.g. personalization message).</param>
        void AddItem(int productId, string attribute, int quantity, string? customText = null);

        /// <summary>
        /// Updates the quantity of an existing item in the cart.
        /// </summary>
        /// <param name="productId">The ID of the product to update.</param>
        /// <param name="attribute">The variant attribute.</param>
        /// <param name="quantity">The new quantity.</param>
        void UpdateQuantity(int productId, string attribute, int quantity);

        /// <summary>
        /// Removes an item from the cart.
        /// </summary>
        /// <param name="productId">The ID of the product to remove.</param>
        /// <param name="attribute">The variant attribute.</param>
        void RemoveItem(int productId, string attribute);

        /// <summary>
        /// Clears all items from the cart.
        /// </summary>
        void ClearCart();
    }
}
