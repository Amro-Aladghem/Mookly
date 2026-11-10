using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MooklyApi.Migrations
{
    /// <inheritdoc />
    public partial class SyncCanvaAndMockInterviewChatSignture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Canvas_Chats_ChatId",
                table: "Canvas");

            migrationBuilder.DropForeignKey(
                name: "FK_MockInterviews_Chats_ChatId",
                table: "MockInterviews");

            migrationBuilder.DropIndex(
                name: "IX_MockInterviews_ChatId",
                table: "MockInterviews");

            migrationBuilder.DropIndex(
                name: "IX_Canvas_ChatId",
                table: "Canvas");

            migrationBuilder.DropColumn(
                name: "ChatId",
                table: "MockInterviews");

            migrationBuilder.DropColumn(
                name: "ChatId",
                table: "Canvas");

            migrationBuilder.AddColumn<string>(
                name: "ChatSignture",
                table: "MockInterviews",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "MockInterviews",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "ChatSignture",
                table: "Canvas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "MockInterviewResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MockInterviewId = table.Column<Guid>(type: "uuid", nullable: false),
                    OverallScore = table.Column<decimal>(type: "numeric", nullable: false),
                    Summary = table.Column<string>(type: "text", nullable: false),
                    Strengths = table.Column<string>(type: "text", nullable: false),
                    AreasForImprovement = table.Column<string>(type: "text", nullable: false),
                    Recommendations = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MockInterviewResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MockInterviewResults_MockInterviews_MockInterviewId",
                        column: x => x.MockInterviewId,
                        principalTable: "MockInterviews",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MockInterviewResults_MockInterviewId",
                table: "MockInterviewResults",
                column: "MockInterviewId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MockInterviewResults");

            migrationBuilder.DropColumn(
                name: "ChatSignture",
                table: "MockInterviews");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "MockInterviews");

            migrationBuilder.DropColumn(
                name: "ChatSignture",
                table: "Canvas");

            migrationBuilder.AddColumn<Guid>(
                name: "ChatId",
                table: "MockInterviews",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "ChatId",
                table: "Canvas",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_MockInterviews_ChatId",
                table: "MockInterviews",
                column: "ChatId");

            migrationBuilder.CreateIndex(
                name: "IX_Canvas_ChatId",
                table: "Canvas",
                column: "ChatId");

            migrationBuilder.AddForeignKey(
                name: "FK_Canvas_Chats_ChatId",
                table: "Canvas",
                column: "ChatId",
                principalTable: "Chats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MockInterviews_Chats_ChatId",
                table: "MockInterviews",
                column: "ChatId",
                principalTable: "Chats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
