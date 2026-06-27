namespace PizzaAdmin.Web.Models.Entities;

public class AuditLog
{
    public int Id { get; set; }
    public string? UserName { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? EntityType { get; set; }
    public string? EntityId { get; set; }
    public string? Detail { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
