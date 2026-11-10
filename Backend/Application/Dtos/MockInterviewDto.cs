namespace Application.Dtos
{
    public class MockInterviewDto
    {
        public Guid? Id { get; set; }
        public string ChatSignture { get; set; } = null!;
        public Guid UserId { get; set; }
        public Guid MockInterviewTypeId { get; set; }
        public string Status { get; set; } = "Scheduled";
        public int? JobTypeId { get; set; }
        public int? JobLevelId { get; set; }
        public string About { get; set; } = null!;
    }
}
