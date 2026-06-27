using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PizzaAdmin.Web.Data;
using PizzaAdmin.Web.Models.Entities;
using Xunit;

namespace PizzaAdmin.Tests;

public class ProductTests
{
    private AppDbContext CreateInMemoryDbContext()
    {
        var connection = new SqliteConnection("Filename=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;

        var context = new AppDbContext(options);
        context.Database.EnsureCreated();
        return context;
    }

    [Fact]
    public async Task Products_FilterAndSearch_ShouldReturnCorrectSubset()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var cat1 = new Category { Name = "Pizza", Slug = "pizza" };
        var cat2 = new Category { Name = "Drinks", Slug = "drinks" };
        db.Categories.AddRange(cat1, cat2);

        var p1 = new Product { Name = "Beef Pizza", Category = cat1, IsActive = true };
        var p2 = new Product { Name = "Chicken Pizza", Category = cat1, IsActive = true };
        var p3 = new Product { Name = "Coca Cola", Category = cat2, IsActive = true };
        db.Products.AddRange(p1, p2, p3);
        await db.SaveChangesAsync();

        // Act: Filter by category (Pizza)
        var pizzaProducts = await db.Products.Where(p => p.CategoryId == cat1.Id).ToListAsync();

        // Assert
        Assert.Equal(2, pizzaProducts.Count);
        Assert.Contains(pizzaProducts, p => p.Name == "Beef Pizza");
        Assert.Contains(pizzaProducts, p => p.Name == "Chicken Pizza");
        Assert.DoesNotContain(pizzaProducts, p => p.Name == "Coca Cola");

        // Act: Search by query "Beef"
        var searchResult = await db.Products.Where(p => p.Name.Contains("Beef")).ToListAsync();

        // Assert
        Assert.Single(searchResult);
        Assert.Equal("Beef Pizza", searchResult[0].Name);
    }
}
