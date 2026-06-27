namespace PizzaAdmin.Web.Services;

public class FileUploadService
{
    private readonly IWebHostEnvironment _env;
    private static readonly HashSet<string> AllowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico"];
    private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

    public FileUploadService(IWebHostEnvironment env) => _env = env;

    public async Task<string?> UploadAsync(IFormFile? file, string folder = "uploads")
    {
        if (file is null || file.Length == 0) return null;
        if (file.Length > MaxFileSize) throw new InvalidOperationException("File quá lớn (tối đa 5MB).");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext)) throw new InvalidOperationException($"Định dạng {ext} không được hỗ trợ.");

        var fileName = $"{Guid.NewGuid():N}{ext}";
        var uploadDir = Path.Combine(_env.WebRootPath, folder);
        Directory.CreateDirectory(uploadDir);

        var filePath = Path.Combine(uploadDir, fileName);
        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return $"/{folder}/{fileName}";
    }

    public void Delete(string? relativePath)
    {
        if (string.IsNullOrWhiteSpace(relativePath)) return;
        var filePath = Path.Combine(_env.WebRootPath, relativePath.TrimStart('/'));
        if (File.Exists(filePath)) File.Delete(filePath);
    }
}
