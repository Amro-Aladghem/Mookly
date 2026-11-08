namespace Application.Dtos
{
    public class CanvaDto
    {
        public Guid? Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ChatId { get; set; }
        public string Content { get; set; } = null!;
        public bool IsSolved { get; set; }
        public string? UserAnswer { get; set; }
        public string CanvaType { get; set; } = "Markdown";
    }
}
