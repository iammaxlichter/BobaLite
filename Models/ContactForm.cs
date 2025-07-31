// ───── Framework Usings ─────────────────────────────
using System.ComponentModel.DataAnnotations;

namespace BobaLite.Models
{
    /// <summary>
    /// Represents the data submitted through the contact form.
    /// </summary>
    public class ContactForm
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(50, ErrorMessage = "Name can be at most 50 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Enter a valid email address")]
        [StringLength(100, ErrorMessage = "Email can be at most 100 characters")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Message is required")]
        [StringLength(1000, ErrorMessage = "Message can be at most 1000 characters")]
        public string Message { get; set; } = string.Empty;
    }
}
