using PizzaAdmin.Web.Data;
using PizzaAdmin.Web.Models.Entities;

namespace PizzaAdmin.Web.Services;

public class AuditService
{
    private readonly AppDbContext _db;
    private readonly IHttpContextAccessor _http;

    public AuditService(AppDbContext db, IHttpContextAccessor http)
    {
        _db = db;
        _http = http;
    }

    public async Task LogAsync(string action, string? entityType = null, string? entityId = null, string? detail = null)
    {
        _db.AuditLogs.Add(new AuditLog
        {
            UserName = _http.HttpContext?.User.Identity?.Name ?? "System",
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            Detail = detail,
            CreatedAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();
    }
}
