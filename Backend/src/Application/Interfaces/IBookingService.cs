using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs.Booking;

namespace Application.Interfaces
{
    public interface IBookingService
    {
        Task<BookingResponseDto> CreateBookingAsync(CreateBookingDto createBookingDto);
        Task<BookingResponseDto?> GetBookingByIdAsync(Guid id);
        Task<IEnumerable<BookingResponseDto>> GetUserBookingHistoryAsync(Guid userId);
        Task<bool> CancelBookingAsync(Guid bookingId);
    }
}
