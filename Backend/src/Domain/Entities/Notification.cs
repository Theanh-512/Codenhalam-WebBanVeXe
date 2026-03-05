using System;

namespace Domain.Entities
{
    public class Notification
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsSent { get; set; } = false;
        public DateTime? SentAt { get; set; }

        public User? User { get; set; }
    }
}
