namespace Application.Dtos
{
    public class CreateMockInterviewDto
    {
        public Guid MockInterviewTypeId { get; set; }
        public int? JobTypeId { get; set; }
        public int? JobLevelId { get; set; }
        public string About { get; set; } = null!;
    }
}
