using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class Canva
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = null!;
        public bool IsSolved { get; set; }
        public Guid UserId { get; set; }
        public string ChatSignture { get; set; } = null!;
        public string? UserAnswer { get; set; }
        public eCanvaType CanvaType { get; set; }

        public User User { get; set; } = null!;
    }
}
