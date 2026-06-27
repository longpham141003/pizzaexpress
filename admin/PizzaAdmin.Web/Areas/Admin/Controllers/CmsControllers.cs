using PizzaAdmin.Web.Data;
using PizzaAdmin.Web.Models.Entities;
using PizzaAdmin.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PizzaAdmin.Web.Areas.Admin.Controllers;

[Area("Admin")]
public class ContactsController : Controller
{
    private readonly AppDbContext _db;
    private readonly AuditService _audit;
    public ContactsController(AppDbContext db, AuditService audit) { _db = db; _audit = audit; }

    public async Task<IActionResult> Index(bool? unreadOnly, int page = 1)
    {
        const int pageSize = 15;
        var q = _db.Contacts.AsQueryable();
        if (unreadOnly == true) q = q.Where(c => !c.IsRead);
        var total = await q.CountAsync();
        var list = await q.OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        ViewBag.UnreadCount = await _db.Contacts.CountAsync(c => !c.IsRead);
        ViewBag.Filter = unreadOnly;
        ViewBag.Page = page;
        ViewBag.TotalPages = (int)Math.Ceiling(total / (double)pageSize);
        ViewBag.TotalItems = total;
        return View(list);
    }

    public async Task<IActionResult> Details(int id)
    {
        var c = await _db.Contacts.FindAsync(id);
        if (c is null) return NotFound();
        if (!c.IsRead) { c.IsRead = true; await _db.SaveChangesAsync(); }
        return View(c);
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> MarkRead(int id)
    {
        var c = await _db.Contacts.FindAsync(id);
        if (c is null) return NotFound();
        c.IsRead = true; await _db.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var c = await _db.Contacts.FindAsync(id);
        if (c is null) return NotFound();
        _db.Contacts.Remove(c); await _db.SaveChangesAsync();
        await _audit.LogAsync("Xóa liên hệ", "Contact", id.ToString(), c.Name);
        TempData["Success"] = "Đã xóa liên hệ.";
        return RedirectToAction(nameof(Index));
    }
}

[Area("Admin")]
public class PostsController : Controller
{
    private readonly AppDbContext _db;
    private readonly FileUploadService _upload;
    private readonly AuditService _audit;
    public PostsController(AppDbContext db, FileUploadService upload, AuditService audit) { _db = db; _upload = upload; _audit = audit; }

    public async Task<IActionResult> Index(string? q, int page = 1)
    {
        const int pageSize = 15;
        var query = _db.Posts.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q)) query = query.Where(p => p.Title.Contains(q) || (p.Summary != null && p.Summary.Contains(q)));
        var total = await query.CountAsync();
        var list = await query.OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        ViewBag.Search = q;
        ViewBag.Page = page;
        ViewBag.TotalPages = (int)Math.Ceiling(total / (double)pageSize);
        ViewBag.TotalItems = total;
        return View(list);
    }
    public IActionResult Create() => View("CreateEdit", new Post());

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Post model, IFormFile? imageFile)
    {
        if (string.IsNullOrWhiteSpace(model.Slug)) model.Slug = ToSlug(model.Title);
        if (!ModelState.IsValid) return View("CreateEdit", model);
        if (imageFile != null) model.ImagePath = await _upload.UploadAsync(imageFile, "uploads/posts");
        _db.Posts.Add(model); await _db.SaveChangesAsync();
        await _audit.LogAsync("Tạo bài viết", "Post", model.Id.ToString(), model.Title);
        TempData["Success"] = "Đã tạo bài viết."; return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id)
    {
        var p = await _db.Posts.FindAsync(id);
        return p is null ? NotFound() : View("CreateEdit", p);
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Post model, IFormFile? imageFile)
    {
        if (string.IsNullOrWhiteSpace(model.Slug)) model.Slug = ToSlug(model.Title);
        if (!ModelState.IsValid) return View("CreateEdit", model);
        var p = await _db.Posts.FindAsync(id); if (p is null) return NotFound();
        p.Title = model.Title; p.Slug = model.Slug; p.Summary = model.Summary;
        p.Content = model.Content; p.IsPublished = model.IsPublished; p.UpdatedAt = DateTime.UtcNow;
        if (imageFile != null) { _upload.Delete(p.ImagePath); p.ImagePath = await _upload.UploadAsync(imageFile, "uploads/posts"); }
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Cập nhật bài viết", "Post", id.ToString(), p.Title);
        TempData["Success"] = "Đã cập nhật bài viết."; return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var p = await _db.Posts.FindAsync(id); if (p is null) return NotFound();
        _upload.Delete(p.ImagePath); _db.Posts.Remove(p); await _db.SaveChangesAsync();
        await _audit.LogAsync("Xóa bài viết", "Post", id.ToString(), p.Title);
        TempData["Success"] = "Đã xóa bài viết."; return RedirectToAction(nameof(Index));
    }

    // ponytail: robust vietnamese accent stripping slug helper
    public static string ToSlug(string s)
    {
        if (string.IsNullOrWhiteSpace(s)) return string.Empty;
        s = s.ToLowerInvariant().Trim();
        string[] vietnamese = new[]
        {
            "aàảãáạăằẳẵắặâầẩẫấậ",
            "dđ",
            "eèẻẽéẹêềểễếệ",
            "iìỉĩíị",
            "oòỏõóọôồổỗốộơờởỡớợ",
            "uùủũúụưừửứự",
            "yỳỷỹýỵ"
        };
        for (int i = 0; i < vietnamese.Length; i++)
        {
            char asciiChar = vietnamese[i][0];
            for (int j = 1; j < vietnamese[i].Length; j++)
            {
                s = s.Replace(vietnamese[i][j], asciiChar);
            }
        }
        s = System.Text.RegularExpressions.Regex.Replace(s, @"\s+", "-");
        s = System.Text.RegularExpressions.Regex.Replace(s, @"[^a-z0-9\-]", "");
        s = System.Text.RegularExpressions.Regex.Replace(s, @"\-+", "-");
        return s.Trim('-');
    }
}

[Area("Admin")]
public class PagesController : Controller
{
    private readonly AppDbContext _db;
    private readonly AuditService _audit;
    public PagesController(AppDbContext db, AuditService audit) { _db = db; _audit = audit; }

    public async Task<IActionResult> Index(string? q, int page = 1)
    {
        const int pageSize = 15;
        var query = _db.Pages.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q)) query = query.Where(p => p.Title.Contains(q));
        var total = await query.CountAsync();
        var list = await query.OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        ViewBag.Search = q;
        ViewBag.Page = page;
        ViewBag.TotalPages = (int)Math.Ceiling(total / (double)pageSize);
        ViewBag.TotalItems = total;
        return View(list);
    }
    public IActionResult Create() => View("CreateEdit", new Page());

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Page model)
    {
        if (string.IsNullOrWhiteSpace(model.Slug)) model.Slug = PostsController.ToSlug(model.Title);
        if (!ModelState.IsValid) return View("CreateEdit", model);
        _db.Pages.Add(model); await _db.SaveChangesAsync();
        await _audit.LogAsync("Tạo trang", "Page", model.Id.ToString(), model.Title);
        TempData["Success"] = "Đã tạo trang."; return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id)
    {
        var p = await _db.Pages.FindAsync(id);
        return p is null ? NotFound() : View("CreateEdit", p);
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Page model)
    {
        if (string.IsNullOrWhiteSpace(model.Slug)) model.Slug = PostsController.ToSlug(model.Title);
        if (!ModelState.IsValid) return View("CreateEdit", model);
        var p = await _db.Pages.FindAsync(id); if (p is null) return NotFound();
        p.Title = model.Title; p.Slug = model.Slug; p.Content = model.Content;
        p.IsPublished = model.IsPublished; p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Cập nhật trang", "Page", id.ToString(), p.Title);
        TempData["Success"] = "Đã cập nhật trang."; return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var p = await _db.Pages.FindAsync(id); if (p is null) return NotFound();
        _db.Pages.Remove(p); await _db.SaveChangesAsync();
        await _audit.LogAsync("Xóa trang", "Page", id.ToString(), p.Title);
        TempData["Success"] = "Đã xóa trang."; return RedirectToAction(nameof(Index));
    }
}
