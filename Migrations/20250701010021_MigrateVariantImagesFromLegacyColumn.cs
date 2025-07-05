using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BobaLite.Migrations
{
    /// <inheritdoc />
    public partial class MigrateVariantImagesFromLegacyColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // create table (already scaffolded for you)…

            // now copy over every non-empty ImageUrl into the new table:
            migrationBuilder.Sql(@"
                INSERT INTO ProductVariantImages (VariantId, Url, SortOrder)
                SELECT Id, ImageUrl, 0
                FROM Variants
                WHERE ImageUrl IS NOT NULL
                AND TRIM(ImageUrl) <> '';
            ");
        }


        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
