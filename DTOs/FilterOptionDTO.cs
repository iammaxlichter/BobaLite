// ───── Project Usings ───────────────────────────────
namespace BobaLite.DTOs
{
    /// <summary>
    /// Represents an individual filter option within a filter group.
    /// </summary>
    /// <param name="Name">The display name of the option.</param>
    /// <param name="Slug">The unique slug for the option.</param>
    /// <param name="Count">The number of products matching this option.</param>
    public record FilterOptionDto(
        string Name,
        string Slug,
        int Count
    );
}
