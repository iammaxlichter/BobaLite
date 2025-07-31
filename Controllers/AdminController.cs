// ───── Framework Usings ─────────────────────────────
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

// ───── System Usings ────────────────────────────────
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

// ───── Project Usings ───────────────────────────────
using BobaLite.Data;
using BobaLite.Models;


namespace BobaLite.Controllers
{
    public class AdminController : Controller
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        #region Constructor
        /// <summary>
        /// Initializes a new instance of the <see cref="AdminController"/> class.
        /// </summary>
        public AdminController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }
        #endregion

        #region GET Methods

        /// <summary>
        /// Displays the Admin dashboard.
        /// </summary>
        [HttpGet]
        public IActionResult Index(int? editProductId = null)
        {
            if (!User.Identity.IsAuthenticated)
                return RedirectToAction("Login");

            var products = _db.Products
                .Include(p => p.Variants).ThenInclude(v => v.Images)
                .Include(p => p.ProductCategories).ThenInclude(pc => pc.Category)
                .ToList();

            ViewBag.AllCategories = _db.Categories.ToList();
            ViewBag.EditProductId = editProductId;
            return View(products);
        }

        /// <summary>
        /// Displays the login page for admin users.
        /// </summary>
        [HttpGet]
        public IActionResult Login(string? returnUrl = null)
        {
            if (User.Identity.IsAuthenticated)
                return RedirectToAction("Index");

            ViewBag.ReturnUrl = returnUrl;
            return View("Index");
        }

        #endregion

        #region POST Methods

        /// <summary>
        /// Handles admin login.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Login(string email, string password, string? returnUrl)
        {
            var user = await _db.AdminUsers.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || !VerifyHash(password, user.PasswordHash))
            {
                ViewBag.ErrorMessage = "Invalid email or password.";
                return View("Index");
            }

            var claims = new List<Claim> { new Claim(ClaimTypes.Name, user.Email) };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties { IsPersistent = true };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);
            return RedirectToAction("Index");
        }

        /// <summary>
        /// Logs the admin user out.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        /// <summary>
        /// Toggles product active/inactive status.
        /// </summary>
        [HttpPost]
        public IActionResult ToggleProductStatus(int id)
        {
            var product = _db.Products.Find(id);
            if (product == null) return NotFound();

            product.IsActive = !product.IsActive;
            _db.SaveChanges();
            return RedirectToAction("Index", new { editProductId = id });
        }

        /// <summary>
        /// Updates stock quantity for a product variant.
        /// </summary>
        [HttpPost]
        public IActionResult UpdateStock(int variantId, int newStock)
        {
            var variant = _db.Variants.Find(variantId);
            if (variant == null) return NotFound();

            variant.Stock = Math.Max(0, newStock);
            _db.SaveChanges();
            return RedirectToAction("Index");
        }

        /// <summary>
        /// Updates the name of a product.
        /// </summary>
        [HttpPost]
        public IActionResult UpdateProductName(int productId, string newName)
        {
            var product = _db.Products.Find(productId);
            if (product == null) return NotFound();

            product.Name = newName;
            _db.SaveChanges();
            return RedirectToAction("Index");
        }

        /// <summary>
        /// Saves product changes, including stock, price, and images.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> SaveProduct(
            int productId,
            string newName,
            int[] variantIds,
            int[] newStocks,
            decimal[] newPrices,
            IFormFile[] variantImages,
            int[] categoryIds,
            string isActive)
        {
            var product = _db.Products
                .Include(p => p.Variants).ThenInclude(v => v.Images)
                .Include(p => p.ProductCategories)
                .FirstOrDefault(p => p.Id == productId);

            if (product == null) return NotFound();

            var oldName = product.Name;
            product.Name = newName;
            product.IsActive = isActive == "true";

            var existingCategoryIds = product.ProductCategories.Select(pc => pc.CategoryId).ToList();

            foreach (var pc in product.ProductCategories.Where(pc => !categoryIds.Contains(pc.CategoryId)).ToList())
                _db.ProductCategories.Remove(pc);

            foreach (var id in categoryIds)
            {
                if (!existingCategoryIds.Contains(id))
                {
                    product.ProductCategories.Add(new ProductCategory { ProductId = productId, CategoryId = id });
                }
            }

            for (int i = 0; i < variantIds.Length; i++)
            {
                var variant = product.Variants.FirstOrDefault(v => v.Id == variantIds[i]);
                if (variant == null) continue;

                variant.Stock = newStocks[i];
                variant.Price = newPrices[i];

                var currentImage = variant.Images.FirstOrDefault();
                var currentImageUrl = currentImage?.Url;

                var uploadedFile = variantImages.ElementAtOrDefault(i);
                if (uploadedFile != null && uploadedFile.Length > 0)
                {
                    if (!string.IsNullOrEmpty(currentImageUrl))
                    {
                        var oldPath = Path.Combine(_env.WebRootPath, currentImageUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                        if (System.IO.File.Exists(oldPath))
                            System.IO.File.Delete(oldPath);
                    }

                    var slugName = newName.ToLower().Replace(" ", "-");
                    var slugAttr = variant.Attributes.ToLower().Replace(" ", "-");
                    var ext = Path.GetExtension(uploadedFile.FileName).ToLower();
                    if (string.IsNullOrEmpty(ext)) ext = ".png";

                    string newFileName = product.Type == "Apparel"
                        ? $"{slugName}.png"
                        : $"{slugName}-{slugAttr}.png";

                    var newPath = Path.Combine(_env.WebRootPath, "images", "Shop", newFileName);
                    var newUrl = $"/images/Shop/{newFileName}";

                    using var stream = new FileStream(newPath, FileMode.Create);
                    await uploadedFile.CopyToAsync(stream);

                    if (currentImage != null)
                        currentImage.Url = newUrl;
                    else
                        variant.Images.Add(new ProductVariantImage { Url = newUrl, SortOrder = 0 });
                }
                else if (!string.IsNullOrEmpty(currentImageUrl))
                {
                    if (oldName != newName)
                    {
                        var currentFileName = Path.GetFileName(currentImageUrl);
                        var oldPath = Path.Combine(_env.WebRootPath, "images", "Shop", currentFileName);

                        var newSlug = newName.ToLower().Replace(" ", "-");
                        var attrSlug = variant.Attributes.ToLower().Replace(" ", "-");

                        string renamedFileName = product.Type == "Apparel"
                            ? $"{newSlug}.png"
                            : $"{newSlug}-{attrSlug}.png";

                        var renamedPath = Path.Combine(_env.WebRootPath, "images", "Shop", renamedFileName);
                        var renamedUrl = $"/images/Shop/{renamedFileName}";

                        if (currentFileName != renamedFileName && System.IO.File.Exists(oldPath))
                        {
                            if (System.IO.File.Exists(renamedPath))
                                System.IO.File.Delete(renamedPath);

                            System.IO.File.Move(oldPath, renamedPath);
                            currentImage.Url = renamedUrl;
                        }
                        else if (currentFileName != renamedFileName && currentImage != null)
                        {
                            currentImage.Url = renamedUrl;
                        }
                    }
                }
            }

            _db.SaveChanges();
            return RedirectToAction("Index");
        }

        /// <summary>
        /// Adds a new product with its variants and images.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> AddProduct(string name, string productType, List<string> variantEnabled, List<int> variantStocks, List<decimal> variantPrices, List<IFormFile> variantImages)
        {
            if (string.IsNullOrWhiteSpace(name) || variantEnabled.Count == 0)
                return RedirectToAction("Index");

            var newProduct = new Product
            {
                Name = name,
                IsActive = false,
                Type = productType,
                Variants = new List<ProductVariant>()
            };

            var uploadPath = Path.Combine(_env.WebRootPath, "images", "Shop");
            Directory.CreateDirectory(uploadPath);

            for (int i = 0; i < variantEnabled.Count; i++)
            {
                var attr = variantEnabled[i];
                var slugName = name.ToLower().Replace(" ", "-");
                var slugAttr = attr.ToLower().Replace(" ", "-");

                string fileName = productType == "Apparel"
                    ? $"{slugName}.png"
                    : $"{slugName}-{slugAttr}.png";
                string filePath = Path.Combine(uploadPath, fileName);
                string url = $"/images/Shop/{fileName}";

                if (i < variantImages.Count && variantImages[i] != null && variantImages[i].Length > 0)
                {
                    using var stream = new FileStream(filePath, FileMode.Create);
                    await variantImages[i].CopyToAsync(stream);
                }

                newProduct.Variants.Add(new ProductVariant
                {
                    Attributes = attr,
                    Stock = i < variantStocks.Count ? variantStocks[i] : 0,
                    Price = i < variantPrices.Count ? variantPrices[i] : 0,
                    Images = new List<ProductVariantImage> { new ProductVariantImage { Url = url, SortOrder = 0 } }
                });
            }

            _db.Products.Add(newProduct);
            await _db.SaveChangesAsync();
            return RedirectToAction("Index", new { editProductId = newProduct.Id });
        }

        /// <summary>
        /// Deletes a product and its related data.
        /// </summary>
        [HttpPost]
        public IActionResult DeleteProduct(int productId)
        {
            var product = _db.Products
                .Include(p => p.Variants).ThenInclude(v => v.Images)
                .Include(p => p.ProductCategories)
                .FirstOrDefault(p => p.Id == productId);

            if (product == null) return NotFound();

            foreach (var variant in product.Variants)
            {
                foreach (var image in variant.Images)
                {
                    var physicalPath = Path.Combine(_env.WebRootPath, image.Url.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                    if (System.IO.File.Exists(physicalPath))
                        System.IO.File.Delete(physicalPath);
                }
            }

            _db.Variants.RemoveRange(product.Variants);
            _db.ProductCategories.RemoveRange(product.ProductCategories);
            _db.Products.Remove(product);
            _db.SaveChanges();

            return RedirectToAction("Index");
        }

        /// <summary>
        /// Adds a new parent category.
        /// </summary>
        [HttpPost]
        public IActionResult AddParentCategory(string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return RedirectToAction("Index");

            var slug = name.ToLower().Replace(" ", "-");
            var exists = _db.Categories.Any(c => c.Name == name && c.ParentCategoryId == null);

            if (!exists)
            {
                _db.Categories.Add(new Category { Name = name, Slug = slug });
                _db.SaveChanges();
            }

            return RedirectToAction("Index");
        }

        /// <summary>
        /// Adds a new child category.
        /// </summary>
        [HttpPost]
        public IActionResult AddChildCategory(int parentId, string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return RedirectToAction("Index");

            var parent = _db.Categories.Find(parentId);
            if (parent == null) return RedirectToAction("Index");

            var slug = name.ToLower().Replace(" ", "-");
            var exists = _db.Categories.Any(c => c.Name == name && c.ParentCategoryId == parentId);

            if (!exists)
            {
                _db.Categories.Add(new Category { Name = name, Slug = slug, ParentCategoryId = parentId });
                _db.SaveChanges();
            }

            return RedirectToAction("Index");
        }

        /// <summary>
        /// Deletes a category and its related child categories.
        /// </summary>
        [HttpPost]
        public IActionResult DeleteCategory(int categoryId)
        {
            var category = _db.Categories.Include(c => c.Children).FirstOrDefault(c => c.Id == categoryId);
            if (category == null) return RedirectToAction("Index");

            if (category.Children != null && category.Children.Any())
                _db.Categories.RemoveRange(category.Children);

            var productLinks = _db.ProductCategories.Where(pc => pc.CategoryId == categoryId).ToList();
            _db.ProductCategories.RemoveRange(productLinks);

            _db.Categories.Remove(category);
            _db.SaveChanges();

            return RedirectToAction("Index");
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Verifies if a password matches its stored hash.
        /// </summary>
        private bool VerifyHash(string password, string storedHash)
        {
            using var sha256 = SHA256.Create();
            var hash = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(password)));
            return hash == storedHash;
        }

        #endregion
    }
}
