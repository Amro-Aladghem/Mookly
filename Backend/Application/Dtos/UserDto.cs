namespace Application.Dtos
{
    public class UserDto
    {
        public Guid? Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string? LastName { get; set; }
        public string? About { get; set; }
        public string JobType { get; set; } = null!;
        public string JobLevel { get; set; } = null!;
        public DateTime CreatedDateTime { get; set; }
    }
}
