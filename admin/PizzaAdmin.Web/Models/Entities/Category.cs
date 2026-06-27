using System.ComponentModel.DataAnnotations;

namespace PizzaAdmin.Web.Models.Entities;

public class Category : ISortable
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập tên danh mục.")]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Slug { get; set; }

    [MaxLength(500)]
    public string? IconPath { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;

    public List<Product> Products { get; set; } = [];
}
