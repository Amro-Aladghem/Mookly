namespace Application.Dtos
{
    public class MockInterviewResultDto
    {
        public Guid? Id { get; set; }
        public Guid MockInterviewId { get; set; }
        public decimal OverallScore { get; set; }
        public string Summary { get; set; } = null!;
        public string Strengths { get; set; } = null!;
        public string AreasForImprovement { get; set; } = null!;
        public string Recommendations { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
