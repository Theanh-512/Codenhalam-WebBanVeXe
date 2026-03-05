using System;

namespace BusTicketing.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "Customer"; // Admin, Staff, Customer
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
