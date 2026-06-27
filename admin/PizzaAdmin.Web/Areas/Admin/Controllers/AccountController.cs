using PizzaAdmin.Web.Models.Entities;
using PizzaAdmin.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.ComponentModel.DataAnnotations;

namespace PizzaAdmin.Web.Areas.Admin.Controllers;

[Area("Admin")]
public class AccountController : Controller
{
    private readonly SignInManager<AppUser> _signIn;
    private readonly UserManager<AppUser> _userMgr;
    private readonly AuditService _audit;

    public AccountController(SignInManager<AppUser> signIn, UserManager<AppUser> userMgr, AuditService audit)
    {
        _signIn = signIn;
        _userMgr = userMgr;
        _audit = audit;
    }

    // ── Login ──
    [AllowAnonymous]
    [HttpGet("admin/login")]
    public IActionResult Login(string? returnUrl = null)
    {
        if (User.Identity?.IsAuthenticated == true) return Redirect("/admin");
        ViewData["ReturnUrl"] = returnUrl;
        return View();
    }

    [AllowAnonymous]
    [HttpPost("admin/login")]
    [EnableRateLimiting("admin-login")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginViewModel model, string? returnUrl = null)
    {
        if (!ModelState.IsValid) return View(model);

        var result = await _signIn.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: true);
        if (result.Succeeded)
        {
            await _audit.LogAsync("Đăng nhập", "Account", model.Email);
            return LocalRedirect(returnUrl ?? "/admin");
        }

        if (result.IsLockedOut)
            ModelState.AddModelError("", "Tài khoản đã bị khóa tạm thời. Vui lòng thử lại sau.");
        else
            ModelState.AddModelError("", "Email hoặc mật khẩu không đúng.");

        return View(model);
    }

    // ── Logout ──
    [HttpGet("admin/logout")]
    public async Task<IActionResult> Logout()
    {
        await _audit.LogAsync("Đăng xuất", "Account", User.Identity?.Name);
        await _signIn.SignOutAsync();
        return Redirect("/admin/login");
    }

    // ── Change Password ──
    [HttpGet]
    public IActionResult ChangePassword() => View();

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
    {
        if (!ModelState.IsValid) return View(model);

        var user = await _userMgr.GetUserAsync(User);
        if (user == null) return Redirect("/admin/login");

        var result = await _userMgr.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
        if (result.Succeeded)
        {
            await _signIn.RefreshSignInAsync(user);
            await _audit.LogAsync("Đổi mật khẩu", "Account", user.Email);
            TempData["Success"] = "Đổi mật khẩu thành công.";
            return RedirectToAction(nameof(ChangePassword));
        }

        foreach (var error in result.Errors)
            ModelState.AddModelError("", error.Description);

        return View(model);
    }
}

// ── ViewModels ──
public class LoginViewModel
{
    [Required(ErrorMessage = "Vui lòng nhập email.")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
    public string Email { get; set; } = "";

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
    [DataType(DataType.Password)]
    public string Password { get; set; } = "";

    public bool RememberMe { get; set; }
}

public class ChangePasswordViewModel
{
    [Required(ErrorMessage = "Vui lòng nhập mật khẩu hiện tại.")]
    [DataType(DataType.Password)]
    public string CurrentPassword { get; set; } = "";

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu mới.")]
    [DataType(DataType.Password)]
    [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
    public string NewPassword { get; set; } = "";

    [Required(ErrorMessage = "Vui lòng xác nhận mật khẩu mới.")]
    [DataType(DataType.Password)]
    [Compare("NewPassword", ErrorMessage = "Mật khẩu xác nhận không khớp.")]
    public string ConfirmPassword { get; set; } = "";
}
