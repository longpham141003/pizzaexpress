using PizzaAdmin.Web.Data;
using PizzaAdmin.Web.Models.Entities;
using PizzaAdmin.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PizzaAdmin.Web.Areas.Admin.Controllers;

[Area("Admin")]
public class SettingsController : Controller
{
    private readonly AppDbContext _db;
    private readonly FileUploadService _upload;
    private readonly AuditService _audit;
    public SettingsController(AppDbContext db, FileUploadService upload, AuditService audit) { _db = db; _upload = upload; _audit = audit; }

    public async Task<IActionResult> Index()
    {
        var settings = await _db.SiteSettings.FirstOrDefaultAsync() ?? new SiteSetting();
        return View(settings);
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Index(SiteSetting model, IFormFile? logoFile, IFormFile? faviconFile)
    {
        var existing = await _db.SiteSettings.FirstOrDefaultAsync();
        if (existing is null)
        {
            if (logoFile != null) model.LogoPath = await _upload.UploadAsync(logoFile, "uploads/branding");
            if (faviconFile != null) model.FaviconPath = await _upload.UploadAsync(faviconFile, "uploads/branding");
            _db.SiteSettings.Add(model);
        }
        else
        {
            existing.SiteName = model.SiteName;
            existing.Slogan = model.Slogan;
            existing.CompanyName = model.CompanyName;
            existing.CompanyAddress = model.CompanyAddress;
            existing.BusinessRegNumber = model.BusinessRegNumber;
            existing.Hotline = model.Hotline;
            existing.FeedbackPhone = model.FeedbackPhone;
            existing.Email = model.Email;
            existing.FacebookUrl = model.FacebookUrl;
            existing.ZaloUrl = model.ZaloUrl;
            existing.MessengerUrl = model.MessengerUrl;
            existing.SeoTitle = model.SeoTitle;
            existing.SeoDescription = model.SeoDescription;
            existing.GoogleAnalyticsId = model.GoogleAnalyticsId;
            existing.GtmId = model.GtmId;
            existing.GoogleAdsId = model.GoogleAdsId;
            existing.FacebookPixelId = model.FacebookPixelId;
            existing.PrimaryColor = model.PrimaryColor;
            existing.SecondaryColor = model.SecondaryColor;
            existing.PrivacyPolicyUrl = model.PrivacyPolicyUrl;
            existing.ReturnPolicyUrl = model.ReturnPolicyUrl;
            existing.PaymentPolicyUrl = model.PaymentPolicyUrl;

            if (logoFile != null) { _upload.Delete(existing.LogoPath); existing.LogoPath = await _upload.UploadAsync(logoFile, "uploads/branding"); }
            if (faviconFile != null) { _upload.Delete(existing.FaviconPath); existing.FaviconPath = await _upload.UploadAsync(faviconFile, "uploads/branding"); }
        }

        await _db.SaveChangesAsync();
        await _audit.LogAsync("Cập nhật cài đặt", "SiteSetting");
        TempData["Success"] = "Đã lưu cài đặt hệ thống.";
        return RedirectToAction(nameof(Index));
    }
}
