using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BobaLite.Migrations
{
    /// <inheritdoc />
    public partial class AddStockToDrinkVariants : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Stock",
                table: "DrinkVariants",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Stock",
                table: "DrinkVariants");
        }
    }
}
