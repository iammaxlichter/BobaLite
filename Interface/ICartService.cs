using BobaLite.DTOs;

namespace BobaLite.Services
{
    public interface ICartService
    {
        CartDto GetCart();
        void AddItem(int productId, string attribute, int quantity = 1);
        void UpdateQuantity(int productId, string attribute, int quantity);
        void RemoveItem(int productId, string attribute);

        void ClearCart();
    }
}
