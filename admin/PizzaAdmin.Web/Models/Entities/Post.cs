using System.ComponentModel.DataAnnotations;

namespace PizzaAdmin.Web.Models.Entities;

public class Post
{
    public int Id { get; set; }

    [Required, MaxLength(500)]
    public string Title { get; set; } = "";

    [Required, MaxLength(500)]
    public string Slug { get; set; } = "";

    public string? Summary { get; set; }
    public string? Content { get; set; } // ponytail: HTML from TinyMCE
    public string? ImagePath { get; set; }

    public bool IsPublished { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
