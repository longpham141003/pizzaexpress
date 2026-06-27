using PizzaAdmin.Web.Data;
using PizzaAdmin.Web.Models.Entities;
using PizzaAdmin.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PizzaAdmin.Web.Areas.Admin.Controllers;

[Area("Admin")]
public class MediaController : Controller
{
    private readonly AppDbContext _db;
    private readonly FileUploadService _upload;
    private readonly AuditService _audit;
    private readonly IWebHostEnvironment _env;

    public MediaController(AppDbContext db, FileUploadService upload, AuditService audit, IWebHostEnvironment env)
    { _db = db; _upload = upload; _audit = audit; _env = env; }

    public async Task<IActionResult> Index(string? type)
    {
        var query = _db.Media.AsQueryable();
        if (!string.IsNullOrEmpty(type))
            query = query.Where(m => m.MimeType != null && m.MimeType.StartsWith(type));

        ViewBag.FilterType = type;
        ViewBag.TotalSize = await _db.Media.SumAsync(m => m.FileSize);
        return View(await query.OrderByDescending(m => m.UploadedAt).ToListAsync());
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Upload(List<IFormFile> files)
    {
        if (!files.Any()) { TempData["Error"] = "Chưa chọn file nào."; return RedirectToAction(nameof(Index)); }

        int count = 0;
        foreach (var file in files)
        {
            try
            {
                var path = await _upload.UploadAsync(file, "uploads/media");
                if (path == null) continue;

                _db.Media.Add(new MediaItem
                {
                    FileName = file.FileName,
                    RelativePath = path,
                    FileSize = file.Length,
                    MimeType = file.ContentType,
                    UploadedAt = DateTime.UtcNow
                });
                count++;
            }
            catch (InvalidOperationException ex)
            {
                TempData["Error"] = ex.Message;
            }
        }

        await _db.SaveChangesAsync();
        await _audit.LogAsync("Upload media", "Media", null, $"{count} file(s)");
        TempData["Success"] = $"Đã upload {count} file.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _db.Media.FindAsync(id);
        if (item is null) return NotFound();

        _upload.Delete(item.RelativePath);
        _db.Media.Remove(item);
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Xóa media", "Media", id.ToString(), item.FileName);
        TempData["Success"] = $"Đã xóa \"{item.FileName}\".";
        return RedirectToAction(nameof(Index));
    }

    // AJAX: return URL for inserting into forms
    [HttpGet]
    public async Task<IActionResult> Browse()
    {
        var items = await _db.Media.OrderByDescending(m => m.UploadedAt).ToListAsync();
        return Json(items.Select(m => new { m.Id, m.FileName, m.RelativePath, m.MimeType, Size = FormatSize(m.FileSize) }));
    }

    private static string FormatSize(long bytes)
    {
        if (bytes < 1024) return $"{bytes} B";
        if (bytes < 1024 * 1024) return $"{bytes / 1024.0:F1} KB";
        return $"{bytes / (1024.0 * 1024.0):F1} MB";
    }
}
