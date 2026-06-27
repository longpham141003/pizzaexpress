using System.ComponentModel.DataAnnotations;

namespace PizzaAdmin.Web.Models.Entities;

public class Review : ISortable
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập tên khách hàng.")]
    [MaxLength(200)]
    public string CustomerName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? AvatarPath { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập nội dung đánh giá.")]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;

    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
