using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class DefaultMessage
    {
        public Guid Id { get; set; }
        public string? Text { get; set; }
        public string? AudioUrl { get; set; }
    }
}
