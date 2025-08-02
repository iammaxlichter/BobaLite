// ───── Project Usings ───────────────────────────────
namespace BobaLite.DTOs.Cart
{
    /// <summary>
    /// Represents the payload for removing an item from the cart.
    /// Items are identified by ProductId, Attribute, and CustomText.
    /// </summary>
    public record RemoveCartRequest(
        int ProductId, 
        string Attribute, 
        string? CustomText
    );
}
