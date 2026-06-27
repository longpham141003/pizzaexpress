namespace PizzaAdmin.Web.Models.Entities;

public class SiteSetting
{
    public int Id { get; set; }

    // Branding
    public string SiteName { get; set; } = "Pizza Express";
    public string? LogoPath { get; set; }
    public string? FooterLogoPath { get; set; }
    public string? FaviconPath { get; set; }
    public string? Slogan { get; set; }

    // Company Info
    public string? CompanyName { get; set; }
    public string? BusinessRegNumber { get; set; }
    public string? CompanyAddress { get; set; }

    // Contact
    public string? Hotline { get; set; }
    public string? FeedbackPhone { get; set; }
    public string? Email { get; set; }

    // Social
    public string? ZaloUrl { get; set; }
    public string? MessengerUrl { get; set; }
    public string? FacebookUrl { get; set; }

    // SEO
    public string? SeoTitle { get; set; }
    public string? SeoDescription { get; set; }
    public string? OgImagePath { get; set; }
    public string? FacebookAppId { get; set; }

    // Analytics
    public string? GoogleAnalyticsId { get; set; }
    public string? GtmId { get; set; }
    public string? GoogleAdsId { get; set; }
    public string? FacebookPixelId { get; set; }

    // Appearance
    public string? PrimaryColor { get; set; }
    public string? SecondaryColor { get; set; }
    public string? AccentColor { get; set; }
    public string? FooterBgImagePath { get; set; }

    // Policy links
    public string? PrivacyPolicyUrl { get; set; }
    public string? ReturnPolicyUrl { get; set; }
    public string? PaymentPolicyUrl { get; set; }
}
