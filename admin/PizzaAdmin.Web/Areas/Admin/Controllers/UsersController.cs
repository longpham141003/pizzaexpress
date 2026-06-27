using PizzaAdmin.Web.Models.Entities;
using PizzaAdmin.Web.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace PizzaAdmin.Web.Areas.Admin.Controllers;

[Area("Admin")]
public class UsersController : Controller
{
    private readonly UserManager<AppUser> _userMgr;
    private readonly RoleManager<IdentityRole> _roleMgr;
    private readonly AuditService _audit;

    public UsersController(UserManager<AppUser> userMgr, RoleManager<IdentityRole> roleMgr, AuditService audit)
    { _userMgr = userMgr; _roleMgr = roleMgr; _audit = audit; }

    public async Task<IActionResult> Index()
    {
        var users = await _userMgr.Users.ToListAsync();
        var userViewModels = new List<UserViewModel>();
        foreach (var u in users)
        {
            var roles = await _userMgr.GetRolesAsync(u);
            userViewModels.Add(new UserViewModel
            {
                Id = u.Id, Email = u.Email ?? "", UserName = u.UserName ?? "",
                Roles = string.Join(", ", roles),
                IsLocked = u.LockoutEnd.HasValue && u.LockoutEnd > DateTimeOffset.UtcNow
            });
        }
        return View(userViewModels);
    }

    public IActionResult Create() => View();

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(CreateUserViewModel model)
    {
        if (!ModelState.IsValid) return View(model);

        var user = new AppUser { UserName = model.Email, Email = model.Email };
        var result = await _userMgr.CreateAsync(user, model.Password);
        if (result.Succeeded)
        {
            if (!await _roleMgr.RoleExistsAsync("Admin"))
                await _roleMgr.CreateAsync(new IdentityRole("Admin"));
            await _userMgr.AddToRoleAsync(user, "Admin");
            await _audit.LogAsync("Tạo user", "User", user.Id, model.Email);
            TempData["Success"] = $"Đã tạo tài khoản \"{model.Email}\".";
            return RedirectToAction(nameof(Index));
        }

        foreach (var err in result.Errors)
            ModelState.AddModelError("", err.Description);
        return View(model);
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Lock(string id)
    {
        var user = await _userMgr.FindByIdAsync(id);
        if (user is null) return NotFound();
        await _userMgr.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddYears(100));
        await _audit.LogAsync("Khóa user", "User", id, user.Email);
        TempData["Success"] = $"Đã khóa tài khoản \"{user.Email}\".";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Unlock(string id)
    {
        var user = await _userMgr.FindByIdAsync(id);
        if (user is null) return NotFound();
        await _userMgr.SetLockoutEndDateAsync(user, null);
        await _userMgr.ResetAccessFailedCountAsync(user);
        await _audit.LogAsync("Mở khóa user", "User", id, user.Email);
        TempData["Success"] = $"Đã mở khóa tài khoản \"{user.Email}\".";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> ResetPassword(string id, string newPassword)
    {
        var user = await _userMgr.FindByIdAsync(id);
        if (user is null) return NotFound();
        var token = await _userMgr.GeneratePasswordResetTokenAsync(user);
        var result = await _userMgr.ResetPasswordAsync(user, token, newPassword);
        if (result.Succeeded)
        {
            await _audit.LogAsync("Reset mật khẩu", "User", id, user.Email);
            TempData["Success"] = $"Đã reset mật khẩu cho \"{user.Email}\".";
        }
        else
        {
            TempData["Error"] = string.Join(", ", result.Errors.Select(e => e.Description));
        }
        return RedirectToAction(nameof(Index));
    }
}

public class UserViewModel
{
    public string Id { get; set; } = "";
    public string Email { get; set; } = "";
    public string UserName { get; set; } = "";
    public string Roles { get; set; } = "";
    public bool IsLocked { get; set; }
}

public class CreateUserViewModel
{
    [Required(ErrorMessage = "Vui lòng nhập email.")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
    public string Email { get; set; } = "";

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
    [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
    [DataType(DataType.Password)]
    public string Password { get; set; } = "";

    [Required(ErrorMessage = "Vui lòng xác nhận mật khẩu.")]
    [Compare("Password", ErrorMessage = "Mật khẩu xác nhận không khớp.")]
    [DataType(DataType.Password)]
    public string ConfirmPassword { get; set; } = "";
}
