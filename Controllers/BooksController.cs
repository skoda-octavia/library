using Microsoft.AspNetCore.Mvc;
using MyLib.Data;
using MyLib.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using MyLib.ViewModels;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Globalization;

namespace MyLib.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        private readonly SignInManager<User> _signInManager;

        public BooksController(AppDbContext appDbContext, SignInManager<User> signInManager)
        {
            _appDbContext = appDbContext;
            _signInManager = signInManager;
        }

        // GET api/books
        [HttpGet]
        public async Task<IActionResult> GetBooks()
        {
            var books = await _appDbContext.Books.ToListAsync();
            return Ok(books);
        }

        // GET api/books/available
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableBooks([FromQuery] string? query)
        {
            var books = _appDbContext.Books.AsQueryable();

            if (!string.IsNullOrEmpty(query))
            {
                books = books.Where(b => b.Title.Contains(query));
            }

            var availableBooks = await books
                .Where(book => !book.Unavailable)
                .Where(book => book.Reservations.All(res => !res.Rented))
                .Where(book => book.Reservations.All(res => res.Expires < DateTime.Now || res.Returned))
                .ToListAsync();

            return Ok(availableBooks);
        }

        // GET api/books/{id}
        [HttpGet("{id}")]
        public IActionResult GetBookDetails(int id)
        {
            var book = _appDbContext.Books.FirstOrDefault(b => b.Id == id);
            if (book == null) return NotFound();

            var bookViewModel = new BookViewModel
            {
                Id = book.Id,
                Title = book.Title,
                Publisher = book.Publisher,
                Author = book.Author,
                Published = book.Published,
                Price = book.Price.ToString("0.##").Replace('.', ','),
                RowVersion = Convert.ToBase64String(book.RowVersion)
            };

            return Ok(bookViewModel);
        }

        // POST api/books
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddBook([FromBody] BookViewModel bookViewModel)
        {
            if (!decimal.TryParse(bookViewModel.Price.Replace(',', '.'), NumberStyles.Any, CultureInfo.InvariantCulture, out var price))
            {
                return BadRequest("Cena musi być poprawną wartością liczbową.");
            }

            var book = new Book
            {
                Title = bookViewModel.Title,
                Publisher = bookViewModel.Publisher,
                Author = bookViewModel.Author,
                Published = bookViewModel.Published,
                Price = Convert.ToDecimal(price),
                Unavailable = false
            };

            _appDbContext.Books.Add(book);
            await _appDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBookDetails), new { id = book.Id }, book);
        }

        // PUT api/books/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] BookViewModel bookViewModel)
        {
            if (id != bookViewModel.Id)
            {
                return BadRequest("ID książki nie pasuje do danych.");
            }

            var book = await _appDbContext.Books.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);
            if (book == null)
            {
                return NotFound("Książka nie została znaleziona.");
            }

            book.Title = bookViewModel.Title;
            book.Publisher = bookViewModel.Publisher;
            book.Author = bookViewModel.Author;
            book.Published = bookViewModel.Published;
            book.Price = decimal.Parse(bookViewModel.Price, CultureInfo.InvariantCulture);

            try
            {
                _appDbContext.Entry(book).OriginalValues["RowVersion"] = Convert.FromBase64String(bookViewModel.RowVersion);
                _appDbContext.Books.Update(book);
                await _appDbContext.SaveChangesAsync();
                return Ok("Książka została pomyślnie zaktualizowana.");
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict("Książka została zmieniona przez innego użytkownika.");
            }
        }

        // DELETE api/books/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _appDbContext.Books.FirstOrDefaultAsync(b => b.Id == id);
            if (book == null)
            {
                return NotFound("Książka nie została znaleziona.");
            }

            var reservations = _appDbContext.Reservation
                .Where(r => r.Book.Id == id && r.Returned).ToList();

            if (reservations.Any())
            {
                book.Unavailable = true;
                _appDbContext.Update(book);
                await _appDbContext.SaveChangesAsync();
                return Ok("Książka została oznaczona jako niedostępna.");
            }

            _appDbContext.Books.Remove(book);
            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }

        // POST api/books/{id}/reserve
        [HttpPost("{id}/reserve")]
        public async Task<IActionResult> ReserveBook(int id)
        {
            if (!_signInManager.IsSignedIn(User))
            {
                return Unauthorized("Musisz być zalogowany, aby zarezerwować książkę.");
            }

            var book = await _appDbContext.Books.FirstOrDefaultAsync(b => b.Id == id);
            if (book == null)
            {
                return NotFound("Książka nie została znaleziona.");
            }

            var existingReservations = _appDbContext.Reservation
                .Where(r => r.Book.Id == id && r.Expires > DateTime.Now).ToList();

            if (existingReservations.Any())
            {
                return BadRequest("Książka już została zarezerwowana.");
            }

            var userId = _signInManager.UserManager.GetUserId(User);
            var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("Użytkownik nie został znaleziony.");
            }

            var reservation = new Reservation
            {
                User = user,
                Book = book,
                Expires = DateTime.Today.AddDays(2).AddSeconds(-1)
            };

            _appDbContext.Reservation.Add(reservation);
            await _appDbContext.SaveChangesAsync();

            return Ok("Książka została zarezerwowana!");
        }
    }
}
