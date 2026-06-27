using PizzaAdmin.Web.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace PizzaAdmin.Web.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext db, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, string email, string password)
    {
        // Roles
        if (!await roleManager.RoleExistsAsync("Admin"))
            await roleManager.CreateAsync(new IdentityRole("Admin"));

        // Admin user
        if (await userManager.FindByEmailAsync(email) == null)
        {
            var user = new AppUser { UserName = email, Email = email, EmailConfirmed = true };
            await userManager.CreateAsync(user, password);
            await userManager.AddToRoleAsync(user, "Admin");
        }

        // Only seed data if empty
        if (await db.Categories.AnyAsync()) return;

        // ── Categories ──
        var catPizza = new Category { Name = "Pizza", Slug = "pizza", SortOrder = 0 };
        var catSuon = new Category { Name = "Sườn BBQ", Slug = "suon-bbq", SortOrder = 1 };
        var catMy = new Category { Name = "Mì Ý", Slug = "mi-y", SortOrder = 2 };
        var catSalad = new Category { Name = "Salad", Slug = "salad", SortOrder = 3 };
        var catDrink = new Category { Name = "Đồ Uống", Slug = "do-uong", SortOrder = 4 };
        var catFrozen = new Category { Name = "Pizza Cấp Đông", Slug = "pizza-cap-dong", SortOrder = 5 };
        var catCombo = new Category { Name = "Combo", Slug = "combo", SortOrder = 6 };
        var catOther = new Category { Name = "Khác", Slug = "khac", SortOrder = 7 };
        db.Categories.AddRange(catPizza, catSuon, catMy, catSalad, catDrink, catFrozen, catCombo, catOther);
        await db.SaveChangesAsync();

        // ── Products: Pizza ──
        var pizzas = new (string name, string img, string ingredients)[]
        {
            ("P1. Beefy Pizza", "uploads/images/P1-2-260x204.jpg", "Thịt bò xay, ngô, sốt BBQ, pho mai."),
            ("P2. Hawaii Pizza", "uploads/images/P2-2-260x204.jpg", "Jam bông, dứa, sốt cà chua, pho mai."),
            ("P3. Salami Pizza", "uploads/images/P3-2-260x204.jpg", "Salami, ớt chuông, sốt cà chua, pho mai."),
            ("P4. Chorizo Pizza", "uploads/images/P4-1-260x204.jpg", "Xúc xích Chorizo, ớt chuông, hành tây, sốt cà chua, pho mai."),
            ("P5. Meat Lovers Pizza", "uploads/images/P5-260x204.png", "Jam bông, thịt bò, xúc xích, salami, sốt cà chua, pho mai."),
            ("P6. BBQ Chicken Pizza", "uploads/images/P6-260x204.png", "Gà, ớt chuông, hành tây, sốt BBQ, pho mai."),
            ("P7. Chicken Curry Pizza", "uploads/images/P7-260x204.png", "Gà, ớt chuông, hành tây, sốt cà ri, pho mai."),
            ("P8. Mexican Pizza", "uploads/images/P8-260x204.png", "Thịt bò, ớt chuông, hành tây, ngô, đậu, sốt Salsa, pho mai."),
            ("P9. Veggie Pizza", "uploads/images/P9-260x204.png", "Ớt chuông, hành tây, nấm, ngô, cà chua, sốt cà chua, pho mai."),
            ("P10. Margherita Pizza", "uploads/images/P10-260x204.png", "Cà chua, sốt cà chua, pho mai Mozzarella."),
            ("P11. Michigan Pizza", "uploads/images/P11-260x204.jpg", "Jam bông, nấm, hành tây, sốt cà chua, pho mai."),
            ("P12. Seafood Pizza", "uploads/images/P12-260x204.jpg", "Tôm, mực, thanh cua, hành tây, sốt cà chua, pho mai."),
            ("P13. Bacon Pizza", "uploads/images/P13-260x204.jpg", "Bacon, hành tây, ớt chuông, sốt cà chua, pho mai."),
            ("P14. Popcorn Chicken Pizza", "uploads/images/P14-1-260x204.jpg", "Gà viên chiên, ớt chuông, hành tây, sốt cà chua, pho mai."),
        };

        for (int i = 0; i < pizzas.Length; i++)
        {
            var p = new Product
            {
                Name = pizzas[i].name, ImagePath = pizzas[i].img, Ingredients = pizzas[i].ingredients,
                CategoryId = catPizza.Id, HasVariants = true, SortOrder = i,
                Variants = [
                    new() { SizeName = "S", SizeLabel = "20cm", Price = 100000, SortOrder = 0 },
                    new() { SizeName = "M", SizeLabel = "24cm", Price = 130000, SortOrder = 1 },
                    new() { SizeName = "L", SizeLabel = "28cm", Price = 160000, SortOrder = 2 },
                ]
            };
            db.Products.Add(p);
        }

        // Sườn BBQ
        db.Products.AddRange(
            new Product { Name = "Sườn nướng BBQ 200gr", ImagePath = "uploads/images/suonbbq.png", Ingredients = "Sườn heo, sốt BBQ đặc biệt", CategoryId = catSuon.Id, HasVariants = false, SinglePrice = 90000, SortOrder = 0 },
            new Product { Name = "Sườn nướng BBQ 500gr", ImagePath = "uploads/images/suonbbq.png", Ingredients = "Sườn heo, sốt BBQ đặc biệt", CategoryId = catSuon.Id, HasVariants = false, SinglePrice = 180000, SortOrder = 1 }
        );

        // Mì Ý
        var pastas = new (string name, string img, decimal price)[]
        {
            ("M1. Spaghetti Bolognese", "uploads/images/M1-260x204.jpg", 70000),
            ("M2. Spaghetti Carbonara", "uploads/images/M1-260x204.jpg", 70000),
            ("M3. Spaghetti Meat Ball", "uploads/images/M1-260x204.jpg", 70000),
            ("M4. Spaghetti Puttanesca", "uploads/images/M4-260x204.png", 70000),
            ("M5. Spaghetti Seafood", "uploads/images/M5-260x204.jpg", 80000),
            ("M6. Shrimp Penne", "uploads/images/M5-260x204.jpg", 80000),
        };
        for (int i = 0; i < pastas.Length; i++)
            db.Products.Add(new Product { Name = pastas[i].name, ImagePath = pastas[i].img, CategoryId = catMy.Id, HasVariants = false, SinglePrice = pastas[i].price, SortOrder = i });

        // Salad
        db.Products.AddRange(
            new Product { Name = "S1. Caesar Salad", ImagePath = "uploads/images/GardenSalad-260x204.jpg", CategoryId = catSalad.Id, HasVariants = false, SinglePrice = 60000, SortOrder = 0 },
            new Product { Name = "S2. Seasonal Salad", ImagePath = "uploads/images/S2-260x204.jpg", CategoryId = catSalad.Id, HasVariants = false, SinglePrice = 60000, SortOrder = 1 }
        );

        // Đồ uống
        db.Products.AddRange(
            new Product { Name = "U1. Coca Cola 390ml", ImagePath = "uploads/images/coca-390ml-370x330-260x204.jpg", CategoryId = catDrink.Id, HasVariants = false, SinglePrice = 15000, SortOrder = 0 },
            new Product { Name = "U2. Coca Cola 1.5L", ImagePath = "uploads/images/Coca-1.5L-260x204.jpg", CategoryId = catDrink.Id, HasVariants = false, SinglePrice = 30000, SortOrder = 1 }
        );

        // Khác
        db.Products.AddRange(
            new Product { Name = "Khoai tây phô mai", ImagePath = "uploads/images/Kv4.Khoai_tay_pho_mai-260x204.jpg", CategoryId = catOther.Id, HasVariants = false, SinglePrice = 50000, SortOrder = 0 },
            new Product { Name = "GVC. Gà Viên Chiên", ImagePath = "uploads/images/popcorn-chicken_2_600x600-260x204.png", CategoryId = catOther.Id, HasVariants = false, SinglePrice = 70000, SortOrder = 1 }
        );

        // ── Banners ──
        db.Banners.AddRange(
            new Banner { Title = "Giảm 20%", DesktopImagePath = "uploads/images/Giảm-20-web.jpg", MobileImagePath = "uploads/images/Giảm-20-mobile.jpg", SortOrder = 0 },
            new Banner { Title = "2 Pizza chỉ từ 160k", DesktopImagePath = "uploads/images/2-pizza-chỉ-từ-160k-web.jpg", MobileImagePath = "uploads/images/2-Pizza-chỉ-từ-160k-mobile.jpg", SortOrder = 1 },
            new Banner { Title = "Sinh nhật", DesktopImagePath = "uploads/images/test.jpg", MobileImagePath = "uploads/images/sinhnhat-1160-x-800-780x538.jpg", SortOrder = 2 },
            new Banner { Title = "Mua 1 pizza tặng 1 Coca", DesktopImagePath = "uploads/images/mua-1-pizza-tặng-1-coca.jpg", MobileImagePath = "uploads/images/Mua-1-pizza-Tặng-1-coca-Mobile-web-Custom-1-780x585.jpg", SortOrder = 3 }
        );

        // ── Locations ──
        db.Locations.AddRange(
            new Location { Name = "Chi nhánh 1", Address = "107 D3 Ngọc Khánh, Giảng Võ", MapUrl = "https://www.pizzaexpress.vn/lien-he/", SortOrder = 0 },
            new Location { Name = "Chi nhánh 2", Address = "14 Ngõ 497 Nguyễn Trãi, Thanh Liệt", MapUrl = "https://www.pizzaexpress.vn/lien-he/", SortOrder = 1 },
            new Location { Name = "Chi nhánh 3", Address = "6 Đồng Bát, Từ Liêm", MapUrl = "https://www.pizzaexpress.vn/lien-he/", SortOrder = 2 },
            new Location { Name = "Chi nhánh 4", Address = "74 Ngõ 521 Trương Định, Hoàng Mai", MapUrl = "https://www.pizzaexpress.vn/lien-he/", SortOrder = 3 }
        );

        // ── Reviews ──
        db.Reviews.AddRange(
            new Review { CustomerName = "Phượng Nguyễn", AvatarPath = "uploads/images/24.png", Content = "Thấy mọi người review khá tốt nên mình gọi thử. Đầu tiên là vô cùng hài lòng với khoản Ship. Mình gọi giờ cao điểm, hẹn 1 tiếng lấy mà mới 30ph đã có nv gọi lấy bánh.", SortOrder = 0 },
            new Review { CustomerName = "Hoàng Chiến", AvatarPath = "uploads/images/15.png", Content = "Đã nghe nói đến nhiều nhưng đến hôm nay mình mới được ăn. Quán có 4 cơ sở nên rất thuận tiện để đặt giao hàng.", SortOrder = 1 },
            new Review { CustomerName = "Nhật Nam", AvatarPath = "uploads/images/13.png", Content = "Nhà mình ngay Giảng Võ nên cũng rất ưa đặt pizza ở Pizza Express Ngọc Khánh gần nhà. Chất lượng pizza ở đây mình thấy ngon lắm nhé.", SortOrder = 2 },
            new Review { CustomerName = "Phuongmac17", AvatarPath = "uploads/images/12.png", Content = "Có mặt sau 40p, nóng hổi. Pizza khá giống pepperonis nhưng nhân vẫn đầy đặn, phô mai vừa vặn thơm ngon.", SortOrder = 3 },
            new Review { CustomerName = "Lê Phương", AvatarPath = "uploads/images/19.png", Content = "Pizza Express Ngọc Khánh khá xa nhà mình nhưng thấy bạn bảo ăn cũng ngon, giá cũng rẻ.", SortOrder = 4 },
            new Review { CustomerName = "Van Hai", AvatarPath = "uploads/images/10.png", Content = "Vỏ bánh giòn rụm, không cứng, lớp phô mai béo ngậy, thơm thơm.", SortOrder = 5 },
            new Review { CustomerName = "Thư Hoàng", AvatarPath = "uploads/images/9.png", Content = "Đợt trước lớp mình ăn liên hoan nên gọi Pizza ở đây ship đến. Trông cũng đẹp mắt, ngon miệng.", SortOrder = 6 },
            new Review { CustomerName = "Hà Trần", AvatarPath = "uploads/images/4.png", Content = "Mỳ nhiều ú ụ mà mình thấy sợi mỳ ở đây ngon hơn những chỗ khác. Sốt bò băm có nhiều thịt bò.", SortOrder = 7 },
            new Review { CustomerName = "Anh Đức", AvatarPath = "uploads/images/5.png", Content = "Nhân viên giao hàng cũng rất nhanh, thân thiện. Vì bánh giao nhanh nên khi đến nơi vẫn nóng.", SortOrder = 8 },
            new Review { CustomerName = "Trần Hiếu", AvatarPath = "uploads/images/7.png", Content = "Đã gọi pizza ở đây khá nhiều lần. Pizza đế dày, mùi vị cũng được và đặc biệt là luôn giao hàng đúng giờ.", SortOrder = 9 },
            new Review { CustomerName = "Hải Yến", AvatarPath = "uploads/images/6.png", Content = "Mình có code giảm 200k nên thấy quá là rẻ luôn. Ship sớm hơn giờ hẹn.", SortOrder = 10 }
        );

        // ── Features (4 điểm nổi bật) ──
        db.Features.AddRange(
            new Feature { Title = "Chất lượng dẫn đầu", Description = "Chú trọng khâu tuyển chọn đội ngũ đầu bếp chuyên nghiệp, thực đơn của Pizza Express luôn được đổi mới, đa dạng.", IconPath = "uploads/images/footer_01.png", SortOrder = 0 },
            new Feature { Title = "Giao hàng đúng giờ", Description = "Pizza Express cam kết luôn giao hàng đúng giờ và chi phí giao hàng rẻ nhất.", IconPath = "uploads/images/footer_02.png", SortOrder = 1 },
            new Feature { Title = "Pizza Take Away", Description = "Mô hình Pizza take away - pizza mang đi giúp khách hàng tiết kiệm thời gian.", IconPath = "uploads/images/footer_03.png", SortOrder = 2 },
            new Feature { Title = "Phục vụ chuyên nghiệp", Description = "Đội ngũ nhân viên mang đầy sức trẻ và nhiệt huyết, luôn lắng nghe nhu cầu của Quý khách.", IconPath = "uploads/images/footer_04.png", SortOrder = 3 }
        );

        // ── Menu Items ──
        db.MenuItems.AddRange(
            new Models.Entities.MenuItem { Label = "Trang chủ", Url = "/", SortOrder = 0 },
            new Models.Entities.MenuItem { Label = "Thực đơn", Url = "/#home_thucdon", SortOrder = 1 },
            new Models.Entities.MenuItem { Label = "Khuyến mại", Url = "/khuyen-mai/", SortOrder = 2 },
            new Models.Entities.MenuItem { Label = "Chính sách", Url = "/chinh-sach/", SortOrder = 3 },
            new Models.Entities.MenuItem { Label = "Blog", Url = "/blog/", SortOrder = 4 },
            new Models.Entities.MenuItem { Label = "Liên hệ", Url = "/lien-he/", SortOrder = 5 }
        );

        // ── Site Settings ──
        db.SiteSettings.Add(new SiteSetting
        {
            SiteName = "Pizza Express",
            LogoPath = "uploads/images/logo.png",
            FooterLogoPath = "uploads/images/footer_logo.png",
            Slogan = "Pizza ngon - Giá rẻ - Vận chuyển tận nhà",
            CompanyName = "Công ty TNHH Pizza Express Việt Nam",
            BusinessRegNumber = "0106675108",
            CompanyAddress = "Số 352 Đường Bưởi, P.Vĩnh Phúc, Q.Ba Đình, TP.Hà Nội",
            Hotline = "(024) 36.888.777",
            FeedbackPhone = "0977.128.833",
            Email = "lienhepizzaexpress@gmail.com",
            ZaloUrl = "https://zalo.me/0819180706",
            MessengerUrl = "http://m.me/119445844878458",
            SeoTitle = "Pizza, Đặt pizza ngon, giá rẻ tại Pizza Express",
            SeoDescription = "Pizza Express - Pizza ngon, giá rẻ, khuyến mãi cả tuần. Mua 1 tặng 1 chỉ với 160.000đ. Tổng đài (24/7): (024) 36.888.777.",
            GoogleAnalyticsId = "UA-127455965-1",
            GtmId = "GTM-K99MBWR",
            GoogleAdsId = "AW-945364856",
            PrimaryColor = "#c00a27",
            SecondaryColor = "#a9001b",
            AccentColor = "#ff9c00",
            PrivacyPolicyUrl = "https://www.pizzaexpress.vn/chinh-sach-bao-mat-thong-tin/",
            ReturnPolicyUrl = "https://www.pizzaexpress.vn/chinh-sach-doi-tra-san-pham-va-hoan-tien/",
            PaymentPolicyUrl = "https://www.pizzaexpress.vn/chinh-sach-thanh-toan/",
        });

        await db.SaveChangesAsync();
    }
}
