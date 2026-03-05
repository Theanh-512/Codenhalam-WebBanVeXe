using System;

namespace Domain.Entities
{
    public class BookingDetail
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public Guid SeatId { get; set; }
        public decimal Price { get; set; }

        public Booking? Booking { get; set; }
        public Seat? Seat { get; set; }
    }
}
