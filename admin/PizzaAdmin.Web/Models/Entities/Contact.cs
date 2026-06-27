using System.ComponentModel.DataAnnotations;

namespace PizzaAdmin.Web.Models.Entities;

public class Contact
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = "";

    [MaxLength(200)]
    public string? Email { get; set; }

    [MaxLength(20)]
    public string? Phone { get; set; }

    [MaxLength(2000)]
    public string? Message { get; set; }

    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
