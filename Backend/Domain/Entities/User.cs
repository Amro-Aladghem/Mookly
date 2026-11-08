using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string? LastName { get; set; }
        public string? About { get; set; }
        public int JobTypeId { get; set; }
        public int JobLevelId { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public JobType JobType { get; set; } = null!;
        public JobLevel JobLevel { get; set; } = null!;
    }
}
