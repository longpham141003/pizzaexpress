using System.ComponentModel.DataAnnotations;

namespace PizzaAdmin.Web.Models.Entities;

public class MenuItem : ISortable
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập tên hiển thị.")]
    [MaxLength(200)]
    public string Label { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Url { get; set; }

    public bool OpenNewTab { get; set; }

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
