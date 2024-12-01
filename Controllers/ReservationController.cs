using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyLib.Data;
using MyLib.Models;
using MyLib.ViewModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MyLib.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        private readonly UserManager<User> _userManager;

        public ReservationsController(AppDbContext appDbContext, UserManager<User> userManager)
        {
            _appDbContext = appDbContext;
            _userManager = userManager;
        }

        // GET api/reservations
        [HttpGet]
        public async Task<IActionResult> GetUserReservations()
        {
            var userId = _userManager.GetUserId(User);
            var reservations = await _appDbContext.Reservation
                .Where(r => r.User.Id == userId && !r.Rented && !r.Returned)
                .Select(r => new ReservationViewModel
                {
                    BookTitle = r.Book.Title,
                    Expires = r.Expires,
                    ReservationId = r.Id
                }).ToListAsync();

            return Ok(reservations);
        }

        // DELETE api/reservations/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _appDbContext.Reservation.FindAsync(id);
            if (reservation == null)
            {
                return NotFound("Rezerwacja nie została znaleziona.");
            }

            _appDbContext.Reservation.Remove(reservation);
            await _appDbContext.SaveChangesAsync();

            return Ok(new { message = "Rezerwacja została usunięta." });
        }

        // GET api/reservations/manage
        [Authorize(Roles = "Admin")]
        [HttpGet("manage")]
        public async Task<IActionResult> GetManageReservations()
        {
            var reservations = await _appDbContext.Reservation
                .Include(r => r.Book)
                .Include(r => r.User)
                .Where(r => !r.Rented && r.Expires > DateTime.Now && !r.Returned)
                .Select(r => new ReservationViewModel
                {
                    ReservationId = r.Id,
                    BookTitle = r.Book.Title,
                    Expires = r.Expires,
                    Username = r.User.UserName
                })
                .ToListAsync();

            return Ok(reservations);
        }

        // GET api/reservations/rented
        [Authorize(Roles = "Admin")]
        [HttpGet("rented")]
        public async Task<IActionResult> GetRentedReservations()
        {
            var reservations = await _appDbContext.Reservation
                .Include(r => r.Book)
                .Include(r => r.User)
                .Where(r => r.Rented)
                .Select(r => new ReservationViewModel
                {
                    ReservationId = r.Id,
                    BookTitle = r.Book.Title,
                    Expires = r.Expires,
                    Username = r.User.UserName
                })
                .ToListAsync();

            return Ok(reservations);
        }

        // POST api/reservations/{id}/rent
        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/rent")]
        public async Task<IActionResult> RentBook(int id)
        {
            var reservation = await _appDbContext.Reservation
                .Include(r => r.Book)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound("Rezerwacja nie została znaleziona.");
            }

            reservation.Rented = true;
            await _appDbContext.SaveChangesAsync();

            return Ok(new { message = "Książka została wypożyczona!" });
        }

        // POST api/reservations/{id}/return
        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/return")]
        public async Task<IActionResult> ReturnBook(int id)
        {
            var reservation = await _appDbContext.Reservation
                .Include(r => r.Book)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound("Rezerwacja nie została znaleziona.");
            }

            reservation.Rented = false;
            reservation.Returned = true;

            _appDbContext.Update(reservation);
            await _appDbContext.SaveChangesAsync();

            return Ok(new { message = "Książka została zwrócona!" });
        }
    }
}
