using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApparelHubERP.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddResetPasswordFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ResetOtpCode",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ResetOtpExpiry",
                table: "Users",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResetOtpCode",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ResetOtpExpiry",
                table: "Users");
        }
    }
}