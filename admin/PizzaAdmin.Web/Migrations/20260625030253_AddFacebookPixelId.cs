using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PizzaAdmin.Web.Migrations
{
    /// <inheritdoc />
    public partial class AddFacebookPixelId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FacebookPixelId",
                table: "SiteSettings",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FacebookPixelId",
                table: "SiteSettings");
        }
    }
}
