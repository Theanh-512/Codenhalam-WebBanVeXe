import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService, Trip, Seat } from '../../services/trip.service';
import { BookingService, CreateBookingDto } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class Booking implements OnInit {
  tripId: string | null = null;
  trip: Trip | null = null;
  seats: Seat[] = [];
  selectedSeatIds: string[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripService: TripService,
    private bookingService: BookingService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.tripId = this.route.snapshot.paramMap.get('id');
    if (this.tripId) {
      this.loadTripData(this.tripId);
    } else {
      this.toastService.showError('Invalid Trip ID');
      this.router.navigate(['/homepage']);
    }
  }

  loadTripData(id: string): void {
    this.isLoading = true;
    this.tripService.getTrip(id).subscribe({
      next: (trip) => {
        this.trip = trip;
        this.loadSeats(id);
      },
      error: () => {
        this.toastService.showError('Failed to load trip details');
        this.isLoading = false;
      }
    });
  }

  loadSeats(tripId: string): void {
    this.tripService.getSeats(tripId).subscribe({
      next: (seats) => {
        this.seats = seats;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.showError('Failed to load seats');
        this.isLoading = false;
      }
    });
  }

  toggleSeat(seat: Seat): void {
    if (seat.status !== 'Available') return;

    const index = this.selectedSeatIds.indexOf(seat.id);
    if (index > -1) {
      this.selectedSeatIds.splice(index, 1);
    } else {
      this.selectedSeatIds.push(seat.id);
    }
  }

  isSelected(seatId: string): boolean {
    return this.selectedSeatIds.includes(seatId);
  }

  get totalAmount(): number {
    return (this.trip?.price || 0) * this.selectedSeatIds.length;
  }

  confirmBooking(): void {
    if (this.selectedSeatIds.length === 0) {
      this.toastService.showWarning('Please select at least one seat');
      return;
    }

    const currentUser = this.authService.getUser();
    if (!this.authService.isLoggedIn() || !currentUser.id) {
      this.toastService.showInfo('Please login to book tickets');
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/booking/${this.tripId}` } });
      return;
    }

    const bookingDto: CreateBookingDto = {
      userId: currentUser.id,
      tripId: this.tripId!,
      seatIds: this.selectedSeatIds
    };

    this.bookingService.createBooking(bookingDto).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Booking successful!');
        // Navigate to a success page or dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.toastService.showError(err.error?.message || 'Booking failed');
      }
    });
  }
}
