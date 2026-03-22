using System;
using System.Collections.Generic;

namespace Application.DTOs.Booking
{
    public class CreateBookingDto
    {
        public Guid UserId { get; set; }
        public Guid TripId { get; set; }
        public List<Guid> SeatIds { get; set; } = new List<Guid>();
    }
}
