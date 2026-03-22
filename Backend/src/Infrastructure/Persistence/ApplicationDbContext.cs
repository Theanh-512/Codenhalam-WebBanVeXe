using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<Bus> Buses { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingDetail> BookingDetails { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UserName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
                entity.Property(e => e.FullName).HasMaxLength(150);
                entity.Property(e => e.PhoneNumber).HasMaxLength(20);
                entity.HasIndex(e => e.Email).IsUnique();

                // Seed Data
                entity.HasData(new User
                {
                    Id = System.Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    UserName = "admin",
                    Email = "admin@vexesystem.com",
                    FullName = "System Administrator",
                    PhoneNumber = "0123456789",
                    PasswordHash = "$2a$11$6qkJTnDJ8oSW9eiB7SUhcuD34W6GjSDNJiqqsQXtD0RVKd/AKyEDq", // Verified Hash for "Admin@123"
                    Role = "Admin",
                    IsActive = true,
                    CreatedAt = new System.DateTime(2026, 1, 1, 0, 0, 0, System.DateTimeKind.Utc)
                });
            });

            modelBuilder.Entity<Route>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Origin).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Destination).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Points).HasMaxLength(500);
                entity.Property(e => e.DistanceKm).IsRequired();
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt).IsRequired(false);

                // Seed Data
                entity.HasData(new Route
                {
                    Id = System.Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Origin = "Sài Gòn",
                    Destination = "Đà Lạt",
                    DistanceKm = 300,
                    IsActive = true,
                    CreatedAt = new System.DateTime(2026, 3, 22, 0, 0, 0, System.DateTimeKind.Utc)
                });
            });

            // Configure Bus
            modelBuilder.Entity<Bus>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.PlateNumber).IsRequired().HasMaxLength(50);

                // Seed Data
                entity.HasData(new Bus
                {
                    Id = System.Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    PlateNumber = "51B-12345",
                    BusType = Domain.Enums.BusType.Limousine,
                    SeatCapacity = 30,
                    IsActive = true
                });
            });

            // Configure Trip
            modelBuilder.Entity<Trip>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Price).HasPrecision(18, 2);
                entity.HasOne(e => e.Route).WithMany(r => r.Trips).HasForeignKey(e => e.RouteId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Bus).WithMany(b => b.Trips).HasForeignKey(e => e.BusId).OnDelete(DeleteBehavior.Restrict);

                // Seed Data
                entity.HasData(new Trip
                {
                    Id = System.Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    RouteId = System.Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    BusId = System.Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    DepartureTime = new System.DateTime(2026, 3, 23, 8, 0, 0, System.DateTimeKind.Utc),
                    ArrivalTime = new System.DateTime(2026, 3, 23, 14, 0, 0, System.DateTimeKind.Utc),
                    Price = 250000,
                    Status = Domain.Enums.TripStatus.Active,
                    CreatedAt = new System.DateTime(2026, 3, 22, 0, 0, 0, System.DateTimeKind.Utc)
                });
            });

            // Configure Seat
            modelBuilder.Entity<Seat>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SeatNumber).IsRequired().HasMaxLength(10);
                entity.HasOne(e => e.Trip).WithMany(t => t.Seats).HasForeignKey(e => e.TripId).OnDelete(DeleteBehavior.Restrict);

                // Seed Seats
                for (int i = 1; i <= 10; i++)
                {
                    entity.HasData(new Seat
                    {
                        Id = System.Guid.Parse($"55555555-5555-5555-5555-{i:D12}"),
                        TripId = System.Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        SeatNumber = $"A{i}",
                        Status = Domain.Enums.SeatStatus.Available
                    });
                }
            });

            // Configure Booking
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
                entity.HasOne(e => e.User).WithMany(u => u.Bookings).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Trip).WithMany(t => t.Bookings).HasForeignKey(e => e.TripId).OnDelete(DeleteBehavior.Restrict);
            });

            // Configure BookingDetail
            modelBuilder.Entity<BookingDetail>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Price).HasPrecision(18, 2);
                entity.HasOne(e => e.Booking).WithMany(b => b.BookingDetails).HasForeignKey(e => e.BookingId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Seat).WithMany(s => s.BookingDetails).HasForeignKey(e => e.SeatId).OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Payment
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Amount).HasPrecision(18, 2);
                entity.Property(e => e.PaymentMethod).HasMaxLength(50);
                entity.Property(e => e.TransactionCode).HasMaxLength(100);
                entity.HasOne(e => e.Booking).WithMany().HasForeignKey(e => e.BookingId).OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Invoice
            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.InvoiceNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
                entity.HasOne(e => e.Booking).WithMany().HasForeignKey(e => e.BookingId).OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Notification
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
