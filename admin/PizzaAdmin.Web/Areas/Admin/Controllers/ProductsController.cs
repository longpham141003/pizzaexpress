using PizzaAdmin.Web.Data;
using PizzaAdmin.Web.Models.Entities;
using PizzaAdmin.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace PizzaAdmin.Web.Areas.Admin.Controllers;

[Area("Admin")]
public class ProductsController : Controller
{
    private readonly AppDbContext _db;
    private readonly FileUploadService _upload;
    private readonly AuditService _audit;

    public ProductsController(AppDbContext db, FileUploadService upload, AuditService audit)
    { _db = db; _upload = upload; _audit = audit; }

    public async Task<IActionResult> Index(int? categoryId, string? q, int page = 1)
    {
        const int pageSize = 15;
        var query = _db.Products.Include(p => p.Category).Include(p => p.Variants)
            .Where(p => !p.IsDeleted).AsQueryable();
        if (categoryId.HasValue) query = query.Where(p => p.CategoryId == categoryId);
        if (!string.IsNullOrWhiteSpace(q)) query = query.Where(p => p.Name.Contains(q));

        var total = await query.CountAsync();
        var items = await query.OrderBy(p => p.SortOrder)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        ViewBag.Categories = await _db.Categories.OrderBy(c => c.SortOrder).ToListAsync();
        ViewBag.SelectedCategory = categoryId;
        ViewBag.Search = q;
        ViewBag.Page = page;
        ViewBag.TotalPages = (int)Math.Ceiling(total / (double)pageSize);
        ViewBag.TotalItems = total;

        return View(items);
    }

    public async Task<IActionResult> Create()
    {
        await LoadCategories();
        return View("CreateEdit", new Product());
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Product model, IFormFile? imageFile, List<ProductVariant> Variants)
    {
        if (!ModelState.IsValid) { await LoadCategories(); return View("CreateEdit", model); }
        if (imageFile != null) model.ImagePath = await _upload.UploadAsync(imageFile);
        if (model.HasVariants && Variants.Any()) model.Variants = Variants;
        _db.Products.Add(model);
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Tạo sản phẩm", "Product", model.Id.ToString(), model.Name);
        TempData["Success"] = $"Đã tạo sản phẩm \"{model.Name}\".";
        return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id)
    {
        var item = await _db.Products.Include(p => p.Variants).FirstOrDefaultAsync(p => p.Id == id);
        if (item is null) return NotFound();
        await LoadCategories();
        return View("CreateEdit", item);
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Product model, IFormFile? imageFile, List<ProductVariant> Variants)
    {
        if (!ModelState.IsValid) { await LoadCategories(); return View("CreateEdit", model); }
        var item = await _db.Products.Include(p => p.Variants).FirstOrDefaultAsync(p => p.Id == id);
        if (item is null) return NotFound();

        item.Name = model.Name;
        item.Description = model.Description;
        item.Ingredients = model.Ingredients;
        item.CategoryId = model.CategoryId;
        item.HasVariants = model.HasVariants;
        item.SinglePrice = model.SinglePrice;
        item.SingleSalePrice = model.SingleSalePrice;
        item.SortOrder = model.SortOrder;
        item.IsActive = model.IsActive;

        if (imageFile != null)
        {
            _upload.Delete(item.ImagePath);
            item.ImagePath = await _upload.UploadAsync(imageFile);
        }

        // Update variants
        _db.ProductVariants.RemoveRange(item.Variants);
        if (model.HasVariants && Variants.Any())
        {
            foreach (var v in Variants) { v.ProductId = id; v.Id = 0; }
            _db.ProductVariants.AddRange(Variants);
        }

        await _db.SaveChangesAsync();
        await _audit.LogAsync("Cập nhật sản phẩm", "Product", id.ToString(), item.Name);
        TempData["Success"] = $"Đã cập nhật \"{item.Name}\".";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _db.Products.FindAsync(id);
        if (item is null) return NotFound();
        item.IsDeleted = true;
        await _db.SaveChangesAsync();
        await _audit.LogAsync("Xóa sản phẩm", "Product", id.ToString(), item.Name);
        TempData["Success"] = $"Đã xóa \"{item.Name}\".";
        return RedirectToAction(nameof(Index));
    }

    private async Task LoadCategories() =>
        ViewBag.CategoryList = new SelectList(await _db.Categories.OrderBy(c => c.SortOrder).ToListAsync(), "Id", "Name");
}
