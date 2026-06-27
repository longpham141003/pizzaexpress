using Xunit;
using PizzaAdmin.Web.Areas.Admin.Controllers;

namespace PizzaAdmin.Tests;

public class CmsTests
{
    [Theory]
    [InlineData("Ăn pizza ngon", "an-pizza-ngon")]
    [InlineData("Hello World!", "hello-world")]
    [InlineData("Special @# Characters", "special-characters")]
    [InlineData("  Trang  tĩnh  mới  ", "trang-tinh-moi")]
    [InlineData("Pizza-Express-2026", "pizza-express-2026")]
    public void ToSlug_ShouldGenerateCorrectSlug(string input, string expected)
    {
        // Act
        var result = PostsController.ToSlug(input);

        // Assert
        Assert.Equal(expected, result);
    }
}
