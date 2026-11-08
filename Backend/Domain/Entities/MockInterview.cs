using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class MockInterview
    {
        public Guid Id { get; set;}
        public Guid ChatId { get; set; }
        public Guid UserId { get; set; }
        public Guid  MockInterviewTypeId { get; set;  }
        public eMockInterviewStatus eMockInterviewStatus { get; set; }
        public int? JobTypeId { get; set; }
        public int? JobLevelId { get; set; }
        public string About { get; set; } = null!;
        public Chat Chat { get; set; } = null!;
        public User User { get; set; } = null!;

        public MockInterviewType MockInterviewType { get; set; } = null!;
        public JobType? JobType { get; set; }
        public JobLevel? JobLevel { get; set; }
    }
}
