namespace PizzaAdmin.Web.Models.Entities;

public interface ISortable
{
    int Id { get; set; }
    int SortOrder { get; set; }
}
