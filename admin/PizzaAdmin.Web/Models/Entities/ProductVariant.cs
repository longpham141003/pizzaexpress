using System.ComponentModel.DataAnnotations;

namespace PizzaAdmin.Web.Models.Entities;

public class ProductVariant
{
    public int Id { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }

    [Required]
    [MaxLength(10)]
    public string SizeName { get; set; } = string.Empty; // "S", "M", "L"

    [MaxLength(50)]
    public string? SizeLabel { get; set; } // "20cm", "24cm", "28cm"

    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }

    public int SortOrder { get; set; }
}
