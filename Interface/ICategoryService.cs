// ───── Project Usings ───────────────────────────────
using BobaLite.DTOs;

namespace BobaLite.Services
{
    /// <summary>
    /// Defines operations for retrieving category filter groups.
    /// </summary>
    public interface ICategoryService
    {
        /// <summary>
        /// Retrieves all top-level category filter groups and their corresponding options.
        /// </summary>
        /// <returns>A collection of <see cref="FilterGroupDto"/> representing category filters.</returns>
        IEnumerable<FilterGroupDto> GetFilterGroups();
    }
}
