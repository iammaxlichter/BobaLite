using Microsoft.AspNetCore.Mvc;
using BobaLite.DTOs;
using BobaLite.Services;

namespace BobaLite.Controllers
{
    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cart;
        public CartController(ICartService cart) => _cart = cart;

        [HttpGet]
        public ActionResult<CartDto> Get() =>
            Ok(_cart.GetCart());

        [HttpPost("add")]
        public IActionResult Add([FromBody] AddToCartRequest dto)
        {
            _cart.AddItem(dto.ProductId, dto.Attribute, dto.Quantity);
            return NoContent();
        }

        [HttpPost("update")]
        public IActionResult Update([FromBody] UpdateCartRequest dto)
        {
            _cart.UpdateQuantity(dto.ProductId, dto.Attribute, dto.Quantity);
            return NoContent();
        }

        [HttpDelete]
        public IActionResult Remove([FromBody] RemoveCartRequest dto)
        {
            _cart.RemoveItem(dto.ProductId, dto.Attribute);
            return NoContent();
        }
    }

    // incoming-payload DTOs
    public record AddToCartRequest(int ProductId, string Attribute, int Quantity);
    public record UpdateCartRequest(int ProductId, string Attribute, int Quantity);
    public record RemoveCartRequest(int ProductId, string Attribute);
}
