using PizzaAdmin.Web.Data;
using PizzaAdmin.Web.Models.Entities;
using PizzaAdmin.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PizzaAdmin.Web.Areas.Admin.Controllers;

[Area("Admin")]
public class BannersController : Controller
{
    private readonly AppDbContext _db;
    private readonly FileUploadService _upload;
    private readonly AuditService _audit;
    public BannersController(AppDbContext db, FileUploadService upload, AuditService audit) { _db = db; _upload = upload; _audit = audit; }

    public async Task<IActionResult> Index() => View(await _db.Banners.OrderBy(b => b.SortOrder).ToListAsync());

    public IActionResult Create() => View("CreateEdit", new Banner());

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Banner model, IFormFile? desktopImage, IFormFile? mobileImage)
    {
        if (!ModelState.IsValid) return View("CreateEdit", model);
        if (desktopImage != null) model.DesktopImagePath = await _upload.UploadAsync(desktopImage, "uploads/banners");
        if (mobileImage != null) model.MobileImagePath = await _upload.UploadAsync(mobileImage, "uploads/banners");
        _db.Banners.Add(model);
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Tạo banner", "Banner", model.Id.ToString(), model.Title);
        TempData["Success"] = "Đã tạo banner.";
        return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id)
    {
        var item = await _db.Banners.FindAsync(id);
        return item is null ? NotFound() : View("CreateEdit", item);
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Banner model, IFormFile? desktopImage, IFormFile? mobileImage)
    {
        if (!ModelState.IsValid) return View("CreateEdit", model);
        var item = await _db.Banners.FindAsync(id);
        if (item is null) return NotFound();
        item.Title = model.Title; item.LinkUrl = model.LinkUrl;
        item.SortOrder = model.SortOrder; item.IsActive = model.IsActive;
        if (desktopImage != null) { _upload.Delete(item.DesktopImagePath); item.DesktopImagePath = await _upload.UploadAsync(desktopImage, "uploads/banners"); }
        if (mobileImage != null) { _upload.Delete(item.MobileImagePath); item.MobileImagePath = await _upload.UploadAsync(mobileImage, "uploads/banners"); }
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Cập nhật banner", "Banner", id.ToString(), item.Title);
        TempData["Success"] = "Đã cập nhật banner.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _db.Banners.FindAsync(id);
        if (item is null) return NotFound();
        _upload.Delete(item.DesktopImagePath); _upload.Delete(item.MobileImagePath);
        _db.Banners.Remove(item);
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Xóa banner", "Banner", id.ToString(), item.Title);
        TempData["Success"] = "Đã xóa banner.";
        return RedirectToAction(nameof(Index));
    }
}
