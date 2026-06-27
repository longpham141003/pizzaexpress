using System.ComponentModel.DataAnnotations;

namespace PizzaAdmin.Web.Models.Entities;

public class Feature : ISortable
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [MaxLength(500)]
    public string? IconPath { get; set; }

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
