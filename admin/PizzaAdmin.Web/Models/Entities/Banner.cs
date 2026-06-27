using System.ComponentModel.DataAnnotations;

namespace PizzaAdmin.Web.Models.Entities;

public class Banner : ISortable
{
    public int Id { get; set; }

    [MaxLength(300)]
    public string? Title { get; set; }

    [MaxLength(500)]
    public string? DesktopImagePath { get; set; }

    [MaxLength(500)]
    public string? MobileImagePath { get; set; }

    [MaxLength(500)]
    public string? LinkUrl { get; set; }

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
