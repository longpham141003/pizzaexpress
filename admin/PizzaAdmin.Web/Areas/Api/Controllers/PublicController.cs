using PizzaAdmin.Web.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PizzaAdmin.Web.Areas.Api.Controllers;

/// <summary>
/// Public API endpoints for the user-facing website.
/// No authentication required — data is public.
/// Responses are cached for performance.
/// </summary>
[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
[ResponseCache(Duration = 60)]
public class PublicController : ControllerBase
{
    private readonly AppDbContext _db;
    public PublicController(AppDbContext db) => _db = db;

    // GET /api/public/settings
    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings()
    {
        var s = await _db.SiteSettings.FirstOrDefaultAsync();
        if (s is null) return Ok(new { });
        return Ok(new
        {
            s.SiteName, s.Slogan, s.LogoPath, s.FaviconPath,
            s.CompanyName, s.CompanyAddress, s.BusinessRegNumber,
            s.Hotline, s.FeedbackPhone, s.Email,
            s.FacebookUrl, s.ZaloUrl, s.MessengerUrl,
            s.SeoTitle, s.SeoDescription,
            s.GoogleAnalyticsId, s.GtmId, s.GoogleAdsId,
            s.PrimaryColor, s.SecondaryColor,
            s.PrivacyPolicyUrl, s.ReturnPolicyUrl, s.PaymentPolicyUrl
        });
    }

    // GET /api/public/menu
    [HttpGet("menu")]
    public async Task<IActionResult> GetMenu() =>
        Ok(await _db.MenuItems
            .Where(m => m.IsActive)
            .OrderBy(m => m.SortOrder)
            .Select(m => new { m.Label, m.Url, m.OpenNewTab })
            .ToListAsync());

    // GET /api/public/banners
    [HttpGet("banners")]
    public async Task<IActionResult> GetBanners() =>
        Ok(await _db.Banners
            .Where(b => b.IsActive)
            .OrderBy(b => b.SortOrder)
            .Select(b => new { b.Title, b.DesktopImagePath, b.MobileImagePath, b.LinkUrl })
            .ToListAsync());

    // GET /api/public/categories
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories() =>
        Ok(await _db.Categories
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .Select(c => new { c.Id, c.Name, c.Slug, c.Description, ProductCount = c.Products.Count(p => !p.IsDeleted && p.IsActive) })
            .ToListAsync());

    // GET /api/public/products?categoryId=1
    [HttpGet("products")]
    public async Task<IActionResult> GetProducts([FromQuery] int? categoryId)
    {
        var q = _db.Products
            .Include(p => p.Variants)
            .Include(p => p.Category)
            .Where(p => !p.IsDeleted && p.IsActive);

        if (categoryId.HasValue) q = q.Where(p => p.CategoryId == categoryId);

        var data = await q.OrderBy(p => p.SortOrder).Select(p => new
        {
            p.Id, p.Name, p.Description, p.Ingredients, p.ImagePath,
            CategoryName = p.Category != null ? p.Category.Name : null,
            CategorySlug = p.Category != null ? p.Category.Slug : null,
            p.HasVariants, p.SinglePrice, p.SingleSalePrice,
            Variants = p.Variants.OrderBy(v => v.SortOrder).Select(v => new
            {
                v.SizeName, v.SizeLabel, v.Price, v.SalePrice
            })
        }).ToListAsync();

        return Ok(data);
    }

    // GET /api/public/products-by-category
    [HttpGet("products-by-category")]
    public async Task<IActionResult> GetProductsByCategory()
    {
        var categories = await _db.Categories
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .Include(c => c.Products.Where(p => !p.IsDeleted && p.IsActive))
                .ThenInclude(p => p.Variants)
            .ToListAsync();

        var result = categories.Select(c => new
        {
            c.Id, c.Name, c.Slug, c.Description,
            Products = c.Products.OrderBy(p => p.SortOrder).Select(p => new
            {
                p.Id, p.Name, p.Description, p.Ingredients, p.ImagePath,
                p.HasVariants, p.SinglePrice, p.SingleSalePrice,
                Variants = p.Variants.OrderBy(v => v.SortOrder).Select(v => new
                {
                    v.SizeName, v.SizeLabel, v.Price, v.SalePrice
                })
            })
        });
        return Ok(result);
    }

    // GET /api/public/features
    [HttpGet("features")]
    public async Task<IActionResult> GetFeatures() =>
        Ok(await _db.Features
            .Where(f => f.IsActive)
            .OrderBy(f => f.SortOrder)
            .Select(f => new { f.Title, f.Description, f.IconPath })
            .ToListAsync());

    // GET /api/public/reviews
    [HttpGet("reviews")]
    public async Task<IActionResult> GetReviews() =>
        Ok(await _db.Reviews
            .Where(r => r.IsActive)
            .OrderBy(r => r.SortOrder)
            .Select(r => new { r.CustomerName, r.Content, r.AvatarPath })
            .ToListAsync());

    // GET /api/public/locations
    [HttpGet("locations")]
    public async Task<IActionResult> GetLocations() =>
        Ok(await _db.Locations
            .Where(l => l.IsActive)
            .OrderBy(l => l.SortOrder)
            .Select(l => new { l.Name, l.Address, l.Phone, l.MapUrl })
            .ToListAsync());

    // POST /api/public/contact
    [HttpPost("contact")]
    [ResponseCache(NoStore = true)]
    public async Task<IActionResult> SubmitContact([FromBody] ContactDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest(new { error = "Tên không được để trống." });
        _db.Contacts.Add(new Models.Entities.Contact
        {
            Name = dto.Name.Trim(),
            Email = dto.Email?.Trim(),
            Phone = dto.Phone?.Trim(),
            Message = dto.Message?.Trim()
        });
        await _db.SaveChangesAsync();
        return Ok(new { success = true });
    }

    // GET /api/public/posts
    [HttpGet("posts")]
    public async Task<IActionResult> GetPosts() =>
        Ok(await _db.Posts.Where(p => p.IsPublished)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new { p.Title, p.Slug, p.Summary, p.ImagePath, p.CreatedAt })
            .ToListAsync());

    // GET /api/public/posts/{slug}
    [HttpGet("posts/{slug}")]
    public async Task<IActionResult> GetPost(string slug)
    {
        var p = await _db.Posts.FirstOrDefaultAsync(x => x.Slug == slug && x.IsPublished);
        if (p is null) return NotFound();
        return Ok(new { p.Title, p.Slug, p.Summary, p.Content, p.ImagePath, p.CreatedAt });
    }

    // GET /api/public/pages/{slug}
    [HttpGet("pages/{slug}")]
    public async Task<IActionResult> GetPage(string slug)
    {
        var p = await _db.Pages.FirstOrDefaultAsync(x => x.Slug == slug && x.IsPublished);
        if (p is null) return NotFound();
        return Ok(new { p.Title, p.Slug, p.Content });
    }
}

// ponytail: inline DTO, no separate file
public record ContactDto(string Name, string? Email, string? Phone, string? Message);
