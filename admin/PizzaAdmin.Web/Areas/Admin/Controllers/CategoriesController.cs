using PizzaAdmin.Web.Data;
using PizzaAdmin.Web.Models.Entities;
using PizzaAdmin.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace PizzaAdmin.Web.Areas.Admin.Controllers;

[Area("Admin")]
public partial class CategoriesController : Controller
{
    private readonly AppDbContext _db;
    private readonly AuditService _audit;
    public CategoriesController(AppDbContext db, AuditService audit) { _db = db; _audit = audit; }

    public async Task<IActionResult> Index() =>
        View(await _db.Categories.Include(c => c.Products).OrderBy(c => c.SortOrder).ToListAsync());

    public IActionResult Create() => View("CreateEdit", new Category());

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Category model)
    {
        if (!ModelState.IsValid) return View("CreateEdit", model);
        model.Slug ??= Slugify(model.Name);
        _db.Categories.Add(model);
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Tạo danh mục", "Category", model.Id.ToString(), model.Name);
        TempData["Success"] = $"Đã tạo danh mục \"{model.Name}\".";
        return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id)
    {
        var item = await _db.Categories.FindAsync(id);
        return item is null ? NotFound() : View("CreateEdit", item);
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Category model)
    {
        if (!ModelState.IsValid) return View("CreateEdit", model);
        var item = await _db.Categories.FindAsync(id);
        if (item is null) return NotFound();
        item.Name = model.Name;
        item.Slug = model.Slug ?? Slugify(model.Name);
        item.Description = model.Description;
        item.SortOrder = model.SortOrder;
        item.IsActive = model.IsActive;
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Cập nhật danh mục", "Category", id.ToString(), item.Name);
        TempData["Success"] = $"Đã cập nhật danh mục \"{item.Name}\".";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _db.Categories.FindAsync(id);
        if (item is null) return NotFound();
        _db.Categories.Remove(item);
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Xóa danh mục", "Category", id.ToString(), item.Name);
        TempData["Success"] = $"Đã xóa danh mục \"{item.Name}\".";
        return RedirectToAction(nameof(Index));
    }

    private static string Slugify(string text)
    {
        text = text.ToLowerInvariant().Trim();
        text = SlugRegex().Replace(text, "");
        text = Regex.Replace(text, @"\s+", "-");
        return text;
    }

    [GeneratedRegex(@"[^a-z0-9\s-]")]
    private static partial Regex SlugRegex();
}
