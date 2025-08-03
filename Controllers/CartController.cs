// ───── Framework Usings ─────────────────────────────
using Microsoft.AspNetCore.Mvc;

// ───── Project Usings ───────────────────────────────
using BobaLite.DTOs;
using BobaLite.DTOs.Cart;
using BobaLite.Services;

namespace BobaLite.Controllers
{
    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cart;

        #region Constructor
        public CartController(ICartService cart) => _cart = cart;
        #endregion

        #region GET Methods
        [HttpGet]
        public ActionResult<CartDto> Get() =>
            Ok(_cart.GetCart());
        #endregion

        #region POST Methods
        [HttpPost("add")]
        public IActionResult Add([FromBody] AddToCartRequest dto)
        {
            _cart.AddItem(dto.ProductId, dto.Attribute, dto.Quantity, dto.CustomText);
            return NoContent();
        }

        [HttpPost("update")]
        public IActionResult Update([FromBody] UpdateCartRequest dto)
        {
            _cart.UpdateQuantity(dto.ProductId, dto.Attribute, dto.Quantity, dto.CustomText);
            return NoContent();
        }

        [HttpDelete]
        public IActionResult Remove([FromBody] RemoveCartRequest dto)
        {
            _cart.RemoveItem(dto.ProductId, dto.Attribute, dto.CustomText);
            return NoContent();
        }

        [HttpPost("clear")]
        public IActionResult Clear()
        {
            _cart.ClearCart();
            return NoContent();
        }
        #endregion
    }
}