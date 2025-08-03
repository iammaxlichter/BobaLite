// ───── Framework Usings ─────────────────────────────
using System;
using System.ComponentModel.DataAnnotations;

namespace BobaLite.Models
{
    /// <summary>
    /// Represents an administrator user for the BobaLite application.
    /// </summary>
    public class AdminUser
    {
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string PasswordHash { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}