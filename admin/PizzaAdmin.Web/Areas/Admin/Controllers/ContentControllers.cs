using PizzaAdmin.Web.Data;
using PizzaAdmin.Web.Models.Entities;
using PizzaAdmin.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PizzaAdmin.Web.Areas.Admin.Controllers;

[Area("Admin")]
public class LocationsController : Controller
{
    private readonly AppDbContext _db;
    private readonly AuditService _audit;
    public LocationsController(AppDbContext db, AuditService audit) { _db = db; _audit = audit; }

    public async Task<IActionResult> Index() => View(await _db.Locations.OrderBy(l => l.SortOrder).ToListAsync());
    public IActionResult Create() => View("CreateEdit", new Location());

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Location model)
    {
        if (!ModelState.IsValid) return View("CreateEdit", model);
        _db.Locations.Add(model); await _db.SaveChangesAsync();
        await _audit.LogAsync("Tạo chi nhánh", "Location", model.Id.ToString(), model.Name);
        TempData["Success"] = "Đã tạo chi nhánh."; return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id) { var i = await _db.Locations.FindAsync(id); return i is null ? NotFound() : View("CreateEdit", i); }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Location model)
    {
        if (!ModelState.IsValid) return View("CreateEdit", model);
        var i = await _db.Locations.FindAsync(id); if (i is null) return NotFound();
        i.Name = model.Name; i.Address = model.Address; i.MapUrl = model.MapUrl; i.Phone = model.Phone; i.SortOrder = model.SortOrder; i.IsActive = model.IsActive;
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Cập nhật chi nhánh", "Location", id.ToString(), i.Name);
        TempData["Success"] = "Đã cập nhật chi nhánh."; return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var i = await _db.Locations.FindAsync(id); if (i is null) return NotFound();
        _db.Locations.Remove(i); await _db.SaveChangesAsync();
        await _audit.LogAsync("Xóa chi nhánh", "Location", id.ToString(), i.Name);
        TempData["Success"] = "Đã xóa chi nhánh."; return RedirectToAction(nameof(Index));
    }
}

[Area("Admin")]
public class ReviewsController : Controller
{
    private readonly AppDbContext _db;
    private readonly FileUploadService _upload;
    private readonly AuditService _audit;
    public ReviewsController(AppDbContext db, FileUploadService upload, AuditService audit) { _db = db; _upload = upload; _audit = audit; }

    public async Task<IActionResult> Index() => View(await _db.Reviews.OrderBy(r => r.SortOrder).ToListAsync());
    public IActionResult Create() => View("CreateEdit", new Review());

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Review model, IFormFile? avatarFile)
    {
        if (!ModelState.IsValid) return View("CreateEdit", model);
        if (avatarFile != null) model.AvatarPath = await _upload.UploadAsync(avatarFile, "uploads/reviews");
        _db.Reviews.Add(model); await _db.SaveChangesAsync();
        await _audit.LogAsync("Tạo đánh giá", "Review", model.Id.ToString(), model.CustomerName);
        TempData["Success"] = "Đã tạo đánh giá."; return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id) { var i = await _db.Reviews.FindAsync(id); return i is null ? NotFound() : View("CreateEdit", i); }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Review model, IFormFile? avatarFile)
    {
        if (!ModelState.IsValid) return View("CreateEdit", model);
        var i = await _db.Reviews.FindAsync(id); if (i is null) return NotFound();
        i.CustomerName = model.CustomerName; i.Content = model.Content; i.SortOrder = model.SortOrder; i.IsActive = model.IsActive;
        if (avatarFile != null) { _upload.Delete(i.AvatarPath); i.AvatarPath = await _upload.UploadAsync(avatarFile, "uploads/reviews"); }
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Cập nhật đánh giá", "Review", id.ToString(), i.CustomerName);
        TempData["Success"] = "Đã cập nhật đánh giá."; return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var i = await _db.Reviews.FindAsync(id); if (i is null) return NotFound();
        _upload.Delete(i.AvatarPath); _db.Reviews.Remove(i); await _db.SaveChangesAsync();
        await _audit.LogAsync("Xóa đánh giá", "Review", id.ToString(), i.CustomerName);
        TempData["Success"] = "Đã xóa đánh giá."; return RedirectToAction(nameof(Index));
    }
}

[Area("Admin")]
public class MenuItemsController : Controller
{
    private readonly AppDbContext _db;
    private readonly AuditService _audit;
    public MenuItemsController(AppDbContext db, AuditService audit) { _db = db; _audit = audit; }

    public async Task<IActionResult> Index() => View(await _db.MenuItems.OrderBy(m => m.SortOrder).ToListAsync());
    public IActionResult Create() => View("CreateEdit", new MenuItem());

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(MenuItem model)
    {
        if (!ModelState.IsValid) return View("CreateEdit", model);
        _db.MenuItems.Add(model); await _db.SaveChangesAsync();
        await _audit.LogAsync("Tạo menu", "MenuItem", model.Id.ToString(), model.Label);
        TempData["Success"] = "Đã tạo mục menu."; return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id) { var i = await _db.MenuItems.FindAsync(id); return i is null ? NotFound() : View("CreateEdit", i); }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, MenuItem model)
    {
        if (!ModelState.IsValid) return View("CreateEdit", model);
        var i = await _db.MenuItems.FindAsync(id); if (i is null) return NotFound();
        i.Label = model.Label; i.Url = model.Url; i.OpenNewTab = model.OpenNewTab; i.SortOrder = model.SortOrder; i.IsActive = model.IsActive;
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Cập nhật menu", "MenuItem", id.ToString(), i.Label);
        TempData["Success"] = "Đã cập nhật mục menu."; return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var i = await _db.MenuItems.FindAsync(id); if (i is null) return NotFound();
        _db.MenuItems.Remove(i); await _db.SaveChangesAsync();
        await _audit.LogAsync("Xóa menu", "MenuItem", id.ToString(), i.Label);
        TempData["Success"] = "Đã xóa mục menu."; return RedirectToAction(nameof(Index));
    }
}

[Area("Admin")]
public class FeaturesController : Controller
{
    private readonly AppDbContext _db;
    private readonly FileUploadService _upload;
    private readonly AuditService _audit;
    public FeaturesController(AppDbContext db, FileUploadService upload, AuditService audit) { _db = db; _upload = upload; _audit = audit; }

    public async Task<IActionResult> Index() => View(await _db.Features.OrderBy(f => f.SortOrder).ToListAsync());
    public IActionResult Create() => View("CreateEdit", new Feature());

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Feature model, IFormFile? iconFile)
    {
        if (!ModelState.IsValid) return View("CreateEdit", model);
        if (iconFile != null) model.IconPath = await _upload.UploadAsync(iconFile, "uploads/features");
        _db.Features.Add(model); await _db.SaveChangesAsync();
        await _audit.LogAsync("Tạo điểm nổi bật", "Feature", model.Id.ToString(), model.Title);
        TempData["Success"] = "Đã tạo điểm nổi bật."; return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id) { var i = await _db.Features.FindAsync(id); return i is null ? NotFound() : View("CreateEdit", i); }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Feature model, IFormFile? iconFile)
    {
        if (!ModelState.IsValid) return View("CreateEdit", model);
        var i = await _db.Features.FindAsync(id); if (i is null) return NotFound();
        i.Title = model.Title; i.Description = model.Description; i.SortOrder = model.SortOrder; i.IsActive = model.IsActive;
        if (iconFile != null) { _upload.Delete(i.IconPath); i.IconPath = await _upload.UploadAsync(iconFile, "uploads/features"); }
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Cập nhật điểm nổi bật", "Feature", id.ToString(), i.Title);
        TempData["Success"] = "Đã cập nhật."; return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var i = await _db.Features.FindAsync(id); if (i is null) return NotFound();
        _upload.Delete(i.IconPath); _db.Features.Remove(i); await _db.SaveChangesAsync();
        await _audit.LogAsync("Xóa điểm nổi bật", "Feature", id.ToString(), i.Title);
        TempData["Success"] = "Đã xóa."; return RedirectToAction(nameof(Index));
    }
}
