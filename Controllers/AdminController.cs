using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Cryptography;
using BobaLite.Data;
using BobaLite.Models;
using Microsoft.EntityFrameworkCore;

namespace BobaLite.Controllers
{
    public class AdminController : Controller
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public AdminController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

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

        [HttpGet]
        public IActionResult Login(string? returnUrl = null)
        {
            if (User.Identity.IsAuthenticated)
                return RedirectToAction("Index");

            ViewBag.ReturnUrl = returnUrl;
            return View("Index");
        }

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

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        private bool VerifyHash(string password, string storedHash)
        {
            using var sha256 = SHA256.Create();
            var hash = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(password)));
            return hash == storedHash;
        }

        [HttpPost]
        public IActionResult ToggleProductStatus(int id)
        {
            var product = _db.Products.Find(id);
            if (product == null) return NotFound();

            product.IsActive = !product.IsActive;
            _db.SaveChanges();
            return RedirectToAction("Index", new { editProductId = id });
        }

        [HttpPost]
        public IActionResult UpdateStock(int variantId, int newStock)
        {
            var variant = _db.Variants.Find(variantId);
            if (variant == null) return NotFound();

            variant.Stock = Math.Max(0, newStock);
            _db.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult UpdateProductName(int productId, string newName)
        {
            var product = _db.Products.Find(productId);
            if (product == null) return NotFound();

            product.Name = newName;
            _db.SaveChanges();
            return RedirectToAction("Index");
        }

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
                    // Delete old file if it exists
                    if (!string.IsNullOrEmpty(currentImageUrl))
                    {
                        var oldPath = Path.Combine(_env.WebRootPath, currentImageUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                        if (System.IO.File.Exists(oldPath))
                        {
                            System.IO.File.Delete(oldPath);
                        }
                    }

                    // Create new file with updated name
                    var slugName = newName.ToLower().Replace(" ", "-");
                    var slugAttr = variant.Attributes.ToLower().Replace(" ", "-");
                    var ext = Path.GetExtension(uploadedFile.FileName).ToLower();
                    if (string.IsNullOrEmpty(ext)) ext = ".png";

                    // Use the same naming convention as AddProduct
                    string newFileName = product.Type == "Apparel"
                        ? $"{slugName}.png"
                        : $"{slugName}-{slugAttr}.png";

                    var newPath = Path.Combine(_env.WebRootPath, "images", "Shop", newFileName);
                    var newUrl = $"/images/Shop/{newFileName}";

                    using var stream = new FileStream(newPath, FileMode.Create);
                    await uploadedFile.CopyToAsync(stream);

                    if (currentImage != null)
                    {
                        currentImage.Url = newUrl;
                    }
                    else
                    {
                        variant.Images.Add(new ProductVariantImage { Url = newUrl, SortOrder = 0 });
                    }
                }
                else if (!string.IsNullOrEmpty(currentImageUrl))
                {
                    // Only rename if the product name actually changed
                    if (oldName != newName)
                    {
                        var currentFileName = Path.GetFileName(currentImageUrl);
                        var currentExtension = Path.GetExtension(currentFileName);
                        var oldPath = Path.Combine(_env.WebRootPath, "images", "Shop", currentFileName);

                        var newSlug = newName.ToLower().Replace(" ", "-");
                        var attrSlug = variant.Attributes.ToLower().Replace(" ", "-");

                        // Use the same naming convention as AddProduct
                        string renamedFileName = product.Type == "Apparel"
                            ? $"{newSlug}.png"
                            : $"{newSlug}-{attrSlug}.png";

                        var renamedPath = Path.Combine(_env.WebRootPath, "images", "Shop", renamedFileName);
                        var renamedUrl = $"/images/Shop/{renamedFileName}";

                        // Only rename if the names are actually different and source file exists
                        if (currentFileName != renamedFileName && System.IO.File.Exists(oldPath))
                        {
                            try
                            {
                                // Delete target file if it exists to avoid conflicts
                                if (System.IO.File.Exists(renamedPath))
                                {
                                    System.IO.File.Delete(renamedPath);
                                }

                                System.IO.File.Move(oldPath, renamedPath);
                                currentImage.Url = renamedUrl;
                            }
                            catch (Exception ex)
                            {
                                System.Diagnostics.Debug.WriteLine($"Failed to rename file: {ex.Message}");
                                // Don't update the URL if rename failed
                            }
                        }
                        else if (currentFileName != renamedFileName)
                        {
                            // File doesn't exist but we should update the URL anyway
                            if (currentImage != null)
                            {
                                currentImage.Url = renamedUrl;
                            }
                        }
                    }
                    // If name didn't change, don't do anything - leave the file and URL as is
                }
            }

            _db.SaveChanges();
            return RedirectToAction("Index");
        }

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
                    : $"{slugName}-{attr.ToLower().Replace(" ", "-")}.png";
                string filePath = Path.Combine(uploadPath, fileName);
                string url = $"/images/Shop/{fileName}";

                if (i < variantImages.Count && variantImages[i] != null && variantImages[i].Length > 0)
                {
                    using var stream = new FileStream(filePath, FileMode.Create);
                    await variantImages[i].CopyToAsync(stream);
                }

                var variant = new ProductVariant
                {
                    Attributes = attr,
                    Stock = i < variantStocks.Count ? variantStocks[i] : 0,
                    Price = i < variantPrices.Count ? variantPrices[i] : 0,
                    Images = new List<ProductVariantImage> { new ProductVariantImage { Url = url, SortOrder = 0 } }
                };

                newProduct.Variants.Add(variant);
            }

            _db.Products.Add(newProduct);
            await _db.SaveChangesAsync();
            return RedirectToAction("Index", new { editProductId = newProduct.Id });
        }

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
                    {
                        System.IO.File.Delete(physicalPath);
                    }
                }
            }

            _db.Variants.RemoveRange(product.Variants);
            _db.ProductCategories.RemoveRange(product.ProductCategories);
            _db.Products.Remove(product);

            _db.SaveChanges();
            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult AddParentCategory(string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return RedirectToAction("Index");

            var slug = name.ToLower().Replace(" ", "-");

            var exists = _db.Categories.Any(c => c.Name == name && c.ParentCategoryId == null);
            if (!exists)
            {
                _db.Categories.Add(new Category
                {
                    Name = name,
                    Slug = slug
                });
                _db.SaveChanges();
            }

            return RedirectToAction("Index");
        }


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
                _db.Categories.Add(new Category
                {
                    Name = name,
                    Slug = slug,
                    ParentCategoryId = parentId
                });
                _db.SaveChanges();
            }

            return RedirectToAction("Index");
        }


        [HttpPost]
        public IActionResult DeleteCategory(int categoryId)
        {
            var category = _db.Categories
                .Include(c => c.Children)
                .FirstOrDefault(c => c.Id == categoryId);

            if (category == null)
                return RedirectToAction("Index");

            // Remove all child categories if this is a parent
            if (category.Children != null && category.Children.Any())
            {
                _db.Categories.RemoveRange(category.Children);
            }

            // Remove all product-category links
            var productLinks = _db.ProductCategories.Where(pc => pc.CategoryId == categoryId).ToList();
            _db.ProductCategories.RemoveRange(productLinks);

            _db.Categories.Remove(category);
            _db.SaveChanges();

            return RedirectToAction("Index");
        }

    }
}
