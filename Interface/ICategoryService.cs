using BobaLite.DTOs;

namespace BobaLite.Services
{
    public interface ICategoryService
    {
        IEnumerable<FilterGroupDto> GetFilterGroups();
    }
}
