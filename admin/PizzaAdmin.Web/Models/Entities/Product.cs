using System.ComponentModel.DataAnnotations;

namespace PizzaAdmin.Web.Models.Entities;

public class Product : ISortable
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập tên sản phẩm.")]
    [MaxLength(300)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(5000)]
    public string? Description { get; set; }

    [MaxLength(2000)]
    public string? Ingredients { get; set; }

    [MaxLength(500)]
    public string? ImagePath { get; set; }

    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    public bool HasVariants { get; set; } = true;

    /// <summary>Giá đơn (khi không có biến thể size)</summary>
    public decimal? SinglePrice { get; set; }
    public decimal? SingleSalePrice { get; set; }

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; }

    public List<ProductVariant> Variants { get; set; } = [];
}
