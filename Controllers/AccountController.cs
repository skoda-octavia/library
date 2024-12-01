using MyLib.ViewModels;
using Microsoft.AspNetCore.Mvc;
using MyLib.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using MyLib.Data;
using MyLib.Data;
using MyLib.Models;

namespace library_zad1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly SignInManager<User> signInManager;
        private readonly UserManager<User> userManager;
        private readonly AppDbContext _appDbContext;

        public AccountController(SignInManager<User> signInManager, UserManager<User> userManager, AppDbContext dBContext)
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
            _appDbContext = dBContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await signInManager.PasswordSignInAsync(model.UserName, model.Password, false, false);

            if (result.Succeeded)
            {
                var user = await userManager.FindByNameAsync(model.UserName);

                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                var roles = await userManager.GetRolesAsync(user);

                var userRole = roles.Contains("Admin") ? "Admin" : "";

                Response.Cookies.Append("userStatus", "signedIn", new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddDays(7),
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict
                });

                return Ok(new { message = "Login successful", role = userRole });
            }
            else
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }
        }


        // POST api/account/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User
            {
                FirstName = model.FirstName,
                Email = model.Email,
                UserName = model.UserName,
                PhoneNumber = model.Phone,
                LastName = model.LastName
            };

            var result = await userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(Login), new { message = "Registration successful" });
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }
                return BadRequest(ModelState);
            }
        }

        // GET api/account/profile
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> Profile()
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found" });
            }

            var model = new ProfileViewModel
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                Phone = user.PhoneNumber
            };

            return Ok(model);
        }

        // PUT api/account/profile
        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found" });
            }

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.UserName = model.UserName;
            user.Email = model.Email;
            user.PhoneNumber = model.Phone;

            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }
                return BadRequest(ModelState);
            }

            return Ok(new { message = "Profile updated successfully" });
        }

        // POST api/account/logout
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return Ok(new { message = "Logout successful" });
        }

        // DELETE api/account/delete
        [HttpDelete("delete")]
        [Authorize]
        public async Task<IActionResult> DeleteAccount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _appDbContext.Users
                .Include(u => u.Reservations)
                .FirstOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            var rentedBooks = user.Reservations.Where(r => r.Rented).ToList();

            if (rentedBooks.Any())
            {
                return BadRequest(new { message = "Cannot delete user due to rented books" });
            }

            _appDbContext.Users.Remove(user);
            await _appDbContext.SaveChangesAsync();
            await signInManager.SignOutAsync();

            return Ok(new { message = "Account deleted successfully" });
        }
    }
}
