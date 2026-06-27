using PizzaAdmin.Web.Models.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace PizzaAdmin.Web.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Banner> Banners => Set<Banner>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Models.Entities.MenuItem> MenuItems => Set<Models.Entities.MenuItem>();
    public DbSet<Feature> Features => Set<Feature>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<MediaItem> Media => Set<MediaItem>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<Contact> Contacts => Set<Contact>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Page> Pages => Set<Page>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Product>(e =>
        {
            e.Property(p => p.Name).IsRequired().HasMaxLength(300);
            e.HasOne(p => p.Category).WithMany(c => c.Products).HasForeignKey(p => p.CategoryId);
            e.HasMany(p => p.Variants).WithOne(v => v.Product).HasForeignKey(v => v.ProductId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<ProductVariant>(e =>
        {
            e.Property(v => v.SizeName).IsRequired().HasMaxLength(10);
        });

        builder.Entity<Category>(e =>
        {
            e.Property(c => c.Name).IsRequired().HasMaxLength(200);
        });

        builder.Entity<Banner>(e =>
        {
            e.Property(b => b.Title).HasMaxLength(300);
        });

        builder.Entity<Location>(e =>
        {
            e.Property(l => l.Name).IsRequired().HasMaxLength(300);
        });

        builder.Entity<Review>(e =>
        {
            e.Property(r => r.CustomerName).IsRequired().HasMaxLength(200);
            e.Property(r => r.Content).IsRequired().HasMaxLength(2000);
        });

        builder.Entity<Models.Entities.MenuItem>(e =>
        {
            e.Property(m => m.Label).IsRequired().HasMaxLength(200);
        });

        builder.Entity<Feature>(e =>
        {
            e.Property(f => f.Title).IsRequired().HasMaxLength(200);
        });

        builder.Entity<MediaItem>(e =>
        {
            e.Property(m => m.FileName).IsRequired();
            e.Property(m => m.RelativePath).IsRequired();
        });

        builder.Entity<Contact>(e =>
        {
            e.Property(c => c.Name).IsRequired().HasMaxLength(200);
            e.HasIndex(c => c.IsRead); // ponytail: index for unread count queries
        });

        builder.Entity<Post>(e =>
        {
            e.Property(p => p.Title).IsRequired().HasMaxLength(500);
            e.Property(p => p.Slug).IsRequired().HasMaxLength(500);
            e.HasIndex(p => p.Slug).IsUnique();
        });

        builder.Entity<Page>(e =>
        {
            e.Property(p => p.Title).IsRequired().HasMaxLength(500);
            e.Property(p => p.Slug).IsRequired().HasMaxLength(500);
            e.HasIndex(p => p.Slug).IsUnique();
        });
    }
}
