using System;

namespace Domain.Entities
{
    public class Invoice
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime IssuedDate { get; set; } = DateTime.UtcNow;
        public decimal TotalAmount { get; set; }

        public Booking? Booking { get; set; }
    }
}
