// ───── Project Usings ───────────────────────────────
namespace BobaLite.DTOs.Cart
{
    /// <summary>
    /// Represents the payload for adding an item to the cart.
    /// </summary>
    public record AddToCartRequest(
        int ProductId, 
        string Attribute, 
        int Quantity, 
        string? CustomText
    );
}
