using PizzaAdmin.Web.Data;
using PizzaAdmin.Web.Models.Entities;
using PizzaAdmin.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace PizzaAdmin.Web.Areas.Admin.Controllers;

[Area("Admin")]
public class AuditLogsController : Controller
{
    private readonly AppDbContext _db;
    public AuditLogsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index(string? entity, string? user, int page = 1)
    {
        const int pageSize = 30;
        var query = _db.AuditLogs.AsQueryable();

        if (!string.IsNullOrEmpty(entity)) query = query.Where(l => l.EntityType == entity);
        if (!string.IsNullOrEmpty(user)) query = query.Where(l => l.UserName == user);

        var total = await query.CountAsync();
        var logs = await query.OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        ViewBag.Page = page;
        ViewBag.TotalPages = (int)Math.Ceiling(total / (double)pageSize);
        ViewBag.FilterEntity = entity;
        ViewBag.FilterUser = user;
        ViewBag.EntityTypes = await _db.AuditLogs.Select(l => l.EntityType).Distinct().Where(e => e != null).ToListAsync();
        ViewBag.Users = await _db.AuditLogs.Select(l => l.UserName).Distinct().ToListAsync();

        return View(logs);
    }
}

[Area("Admin")]
public class BackupController : Controller
{
    private readonly AppDbContext _db;
    private readonly AuditService _audit;
    public BackupController(AppDbContext db, AuditService audit) { _db = db; _audit = audit; }

    public IActionResult Index() => View();

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Export()
    {
        var data = new
        {
            ExportedAt = DateTime.UtcNow,
            Categories = await _db.Categories.ToListAsync(),
            Products = await _db.Products.Include(p => p.Variants).ToListAsync(),
            Banners = await _db.Banners.ToListAsync(),
            Locations = await _db.Locations.ToListAsync(),
            Reviews = await _db.Reviews.ToListAsync(),
            MenuItems = await _db.MenuItems.ToListAsync(),
            Features = await _db.Features.ToListAsync(),
            SiteSettings = await _db.SiteSettings.FirstOrDefaultAsync()
        };

        var json = JsonSerializer.Serialize(data, new JsonSerializerOptions 
        { 
            WriteIndented = true, 
            ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles 
        });
        await _audit.LogAsync("Export dữ liệu", "Backup");
        return File(System.Text.Encoding.UTF8.GetBytes(json), "application/json",
            $"pizza_express_backup_{DateTime.Now:yyyyMMdd_HHmmss}.json");
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Import(IFormFile file)
    {
        if (file is null || file.Length == 0)
        {
            TempData["Error"] = "Chưa chọn file backup.";
            return RedirectToAction(nameof(Index));
        }

        try
        {
            using var reader = new StreamReader(file.OpenReadStream());
            var json = await reader.ReadToEndAsync();
            var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            int imported = 0;

            // Import Categories
            if (root.TryGetProperty("Categories", out var cats))
            {
                var categories = JsonSerializer.Deserialize<List<Category>>(cats.GetRawText(),
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (categories != null)
                {
                    foreach (var c in categories)
                    {
                        if (!await _db.Categories.AnyAsync(x => x.Name == c.Name))
                        {
                            c.Id = 0;
                            _db.Categories.Add(c);
                            imported++;
                        }
                    }
                }
            }

            // Import Locations
            if (root.TryGetProperty("Locations", out var locs))
            {
                var locations = JsonSerializer.Deserialize<List<Location>>(locs.GetRawText(),
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (locations != null)
                {
                    foreach (var l in locations)
                    {
                        if (!await _db.Locations.AnyAsync(x => x.Name == l.Name))
                        {
                            l.Id = 0;
                            _db.Locations.Add(l);
                            imported++;
                        }
                    }
                }
            }

            // Import Reviews
            if (root.TryGetProperty("Reviews", out var revs))
            {
                var reviews = JsonSerializer.Deserialize<List<Review>>(revs.GetRawText(),
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (reviews != null)
                {
                    foreach (var r in reviews)
                    {
                        if (!await _db.Reviews.AnyAsync(x => x.CustomerName == r.CustomerName && x.Content == r.Content))
                        {
                            r.Id = 0;
                            _db.Reviews.Add(r);
                            imported++;
                        }
                    }
                }
            }

            await _db.SaveChangesAsync();
            await _audit.LogAsync("Import dữ liệu", "Backup", null, $"{imported} records");
            TempData["Success"] = $"Đã import {imported} bản ghi mới (bỏ qua trùng lặp).";
        }
        catch (Exception ex)
        {
            TempData["Error"] = $"Lỗi import: {ex.Message}";
        }

        return RedirectToAction(nameof(Index));
    }
}
