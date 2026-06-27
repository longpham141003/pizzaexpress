using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authorization;

namespace PizzaAdmin.Web.Infrastructure;

/// <summary>
/// Tự động thêm [Authorize] cho tất cả controllers trong Area "Admin",
/// trừ những action đã có [AllowAnonymous].
/// </summary>
public class AdminAreaAuthorizeConvention : IControllerModelConvention
{
    public void Apply(ControllerModel controller)
    {
        if (controller.RouteValues.TryGetValue("area", out var area) &&
            string.Equals(area, "Admin", StringComparison.OrdinalIgnoreCase))
        {
            controller.Filters.Add(new AuthorizeFilter());
        }
    }
}
