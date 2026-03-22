using System;
using System.Collections.Generic;

namespace Application.DTOs.Booking
{
    public class BookingResponseDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public Guid TripId { get; set; }
        public decimal TotalAmount { get; set; }
        public string BookingStatus { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<BookingDetailDto> Details { get; set; } = new List<BookingDetailDto>();
    }
}
