// ───── Project Usings ───────────────────────────────
namespace BobaLite.DTOs.Cart
{
    /// <summary>
    /// Represents the payload for updating the quantity of an item in the cart.
    /// Items are identified by ProductId, Attribute, and CustomText.
    /// </summary>
    public record UpdateCartRequest(
        int ProductId, 
        string Attribute, 
        int Quantity, 
        string? CustomText
    );
}
