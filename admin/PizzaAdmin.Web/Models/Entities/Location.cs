using System.ComponentModel.DataAnnotations;

namespace PizzaAdmin.Web.Models.Entities;

public class Location : ISortable
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập tên chi nhánh.")]
    [MaxLength(300)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Address { get; set; }

    [MaxLength(500)]
    public string? MapUrl { get; set; }

    [MaxLength(50)]
    public string? Phone { get; set; }

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
