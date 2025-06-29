// Data/IProductRepository.cs
using BobaLite.Models;

namespace BobaLite.Data
{
    public interface IProductRepository
    {
        ProductVariant? GetVariant(int productId, string attribute);


        /// <summary> Load the base Product by its ID. </summary>
        Product? GetProduct(int productId);
    }
}
