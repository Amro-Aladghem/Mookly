namespace Application.Dtos
{
    public class GetMockInterviewDto
    {
        public Guid? Id { get; set; }
        public string ChatSignture { get; set; } = null!;
        public Guid UserId { get; set; }
        public string MockInterviewType { get; set; } = null!;
        public string Status { get; set; } = "Scheduled";
        public string? JobType { get; set; }
        public string? JobLevel { get; set; }
        public string About { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
