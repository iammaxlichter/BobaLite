using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BobaLite.Migrations
{
    /// <inheritdoc />
    public partial class RenameDrinksToProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1) Rename table Drinks → Products
            migrationBuilder.RenameTable(
                name: "Drinks",
                newName: "Products");

            // 2) Add the new columns on Products
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Products",
                type: "TEXT",
                nullable: false,
                defaultValue: "Drink");

            // 3) Rename DrinkVariants → Variants
            migrationBuilder.RenameTable(
                name: "DrinkVariants",
                newName: "Variants");

            // 4) Add the new Attributes column to Variants
            migrationBuilder.AddColumn<string>(
                name: "Attributes",
                table: "Variants",
                type: "TEXT",
                nullable: true);

            // 5) Fix up the FK on Variants.ProductId → Products.Id
            migrationBuilder.DropForeignKey(
                name: "FK_DrinkVariants_Drinks_DrinkId",
                table: "Variants");

            migrationBuilder.RenameColumn(
                name: "DrinkId",
                table: "Variants",
                newName: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Variants_Products_ProductId",
                table: "Variants",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            // 6) (Optional) Rename the IX if you have one
            migrationBuilder.RenameIndex(
                name: "IX_DrinkVariants_DrinkId",
                table: "Variants",
                newName: "IX_Variants_ProductId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // reverse in exact opposite order

            migrationBuilder.DropForeignKey("FK_Variants_Products_ProductId", "Variants");

            migrationBuilder.RenameIndex(
                name: "IX_Variants_ProductId",
                table: "Variants",
                newName: "IX_DrinkVariants_DrinkId");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "Variants",
                newName: "DrinkId");

            migrationBuilder.AddForeignKey(
                name: "FK_DrinkVariants_Drinks_DrinkId",
                table: "Variants",
                column: "DrinkId",
                principalTable: "Drinks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.DropColumn("Attributes", "Variants");

            migrationBuilder.RenameTable(
                name: "Variants",
                newName: "DrinkVariants");

            migrationBuilder.DropColumn("Type", "Products");
            migrationBuilder.DropColumn("Description", "Products");

            migrationBuilder.RenameTable(
                name: "Products",
                newName: "Drinks");
        }
    }
}
