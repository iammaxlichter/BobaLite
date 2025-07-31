// ───── Project Usings ───────────────────────────────
namespace BobaLite.DTOs.Cart
{
    /// <summary>
    /// Represents the payload for removing an item from the cart.
    /// </summary>
    public record RemoveCartRequest(int ProductId, string Attribute);
}
