using PizzaAdmin.Web.Data;
using PizzaAdmin.Web.Infrastructure;
using PizzaAdmin.Web.Models.Entities;
using PizzaAdmin.Web.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews(o =>
    o.Conventions.Add(new AdminAreaAuthorizeConvention()));

builder.Services.AddScoped<FileUploadService>();
builder.Services.AddScoped<AuditService>();

builder.Services.AddHttpContextAccessor();

builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlite(builder.Configuration.GetConnectionString("Default"))
     .ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning)));

builder.Services.AddDefaultIdentity<AppUser>(o =>
    {
        o.SignIn.RequireConfirmedAccount = false;
        o.Lockout.AllowedForNewUsers = true;
        o.Lockout.MaxFailedAccessAttempts = builder.Configuration.GetValue("Security:MaxFailedAccessAttempts", 5);
        o.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(builder.Configuration.GetValue("Security:LockoutMinutes", 15));
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>();

builder.Services.AddRateLimiter(o =>
{
    var permitLimit = builder.Configuration.GetValue("Security:LoginRateLimitPermitLimit", 10);
    var window = TimeSpan.FromMinutes(builder.Configuration.GetValue("Security:LoginRateLimitWindowMinutes", 1));
    o.AddPolicy("admin-login", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = permitLimit,
                Window = window,
                QueueLimit = 0,
                AutoReplenishment = true
            }));
    o.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "text/html; charset=utf-8";
        await context.HttpContext.Response.WriteAsync("Đăng nhập quá nhiều lần. Vui lòng thử lại sau ít phút.", token);
    };
});

builder.Services.ConfigureApplicationCookie(o =>
{
    o.LoginPath = "/admin/login";
    o.LogoutPath = "/admin/logout";
    o.AccessDeniedPath = "/admin/login";
});

// CORS for public API (user-facing website)
builder.Services.AddCors(o => o.AddPolicy("PublicApi", b =>
    b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

// Response caching for API performance
builder.Services.AddResponseCaching();

var app = builder.Build();

// Auto-migrate & seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var cfgEmail = builder.Configuration["AdminUser:Email"];
    var cfgPassword = builder.Configuration["AdminUser:Password"];
    DataSeeder.SeedAsync(
        db,
        userManager,
        roleManager,
        cfgEmail ?? "admin@pizzaexpress.vn",
        cfgPassword ?? "Admin@12345").GetAwaiter().GetResult();
}

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// ponytail: serve user-facing website from workspace root at "/"
var clientRoot = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, "..", ".."));
app.UseDefaultFiles(new DefaultFilesOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(clientRoot),
    RequestPath = ""
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(clientRoot),
    RequestPath = ""
});

app.UseStaticFiles();
app.UseRouting();
app.UseCors("PublicApi");
app.UseRateLimiter();
app.UseResponseCaching();
app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();
app.MapControllers(); // API attribute-routed controllers

app.MapControllerRoute(
    name: "admin-login",
    pattern: "admin/login",
    defaults: new { area = "Admin", controller = "Account", action = "Login" });

app.MapControllerRoute(
    name: "admin-logout",
    pattern: "admin/logout",
    defaults: new { area = "Admin", controller = "Account", action = "Logout" });

app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Dashboard}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();

public partial class Program { }
