// ───── Project Usings ───────────────────────────────
namespace BobaLite.DTOs
{
    /// <summary>
    /// Represents a group of filter options (e.g. "Category" or "Flavor").
    /// </summary>
    /// <param name="Name">The display name of the filter group.</param>
    /// <param name="Slug">The unique slug used for filtering.</param>
    /// <param name="Options">The available filter options in this group.</param>
    public record FilterGroupDto(
        string Name,
        string Slug,
        IEnumerable<FilterOptionDto> Options
    );
}
