using PizzaAdmin.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PizzaAdmin.Web.Areas.Admin.Controllers;

[Area("Admin")]
public class DashboardController : Controller
{
    private readonly AppDbContext _db;

    public DashboardController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        ViewBag.ProductCount = await _db.Products.CountAsync(p => !p.IsDeleted);
        ViewBag.CategoryCount = await _db.Categories.CountAsync();
        ViewBag.ReviewCount = await _db.Reviews.CountAsync();
        ViewBag.LocationCount = await _db.Locations.CountAsync();
        ViewBag.BannerCount = await _db.Banners.CountAsync();
        ViewBag.MenuItemCount = await _db.MenuItems.CountAsync();
        ViewBag.FeatureCount = await _db.Features.CountAsync();
        ViewBag.PostCount = await _db.Posts.CountAsync();
        ViewBag.PageCount = await _db.Pages.CountAsync();
        ViewBag.ContactCount = await _db.Contacts.CountAsync();
        ViewBag.UnreadContactCount = await _db.Contacts.CountAsync(c => !c.IsRead);
        ViewBag.MediaCount = await _db.Media.CountAsync();

        ViewBag.RecentProducts = await _db.Products.Where(p => !p.IsDeleted).Include(p => p.Category)
            .OrderByDescending(p => p.Id).Take(5).ToListAsync();
        ViewBag.RecentLogs = await _db.AuditLogs.OrderByDescending(l => l.CreatedAt).Take(10).ToListAsync();
        ViewBag.RecentContacts = await _db.Contacts.Where(c => !c.IsRead).OrderByDescending(c => c.CreatedAt).Take(5).ToListAsync();
        return View();
    }
}
