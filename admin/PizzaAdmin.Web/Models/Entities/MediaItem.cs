namespace PizzaAdmin.Web.Models.Entities;

public class MediaItem
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string RelativePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string? MimeType { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
