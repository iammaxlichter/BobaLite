namespace BobaLite.DTOs
{
    public record FilterGroupDto(
        string Name,
        string Slug,
        IEnumerable<FilterOptionDto> Options
    );
}
