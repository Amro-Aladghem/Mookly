using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class MockInterviewResult
    {
        public Guid Id { get; set; }
        public Guid MockInterviewId { get; set; }

        // Overall score (0 - 100)
        public decimal OverallScore { get; set; }

        public string Summary { get; set; } = null!;

        public string Strengths { get; set; } = null!;

        public string AreasForImprovement { get; set; } = null!;

        public string Recommendations { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public MockInterview MockInterview { get; set; } = null!;
    }
}
