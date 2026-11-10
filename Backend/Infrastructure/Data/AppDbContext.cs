using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var foreignKey in modelBuilder.Model
                                           .GetEntityTypes()
                                           .SelectMany(e => e.GetForeignKeys()))
            {
                foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
            }

            modelBuilder.Entity<ChatRole>().HasData(
                new ChatRole { Id = 1, Name = "InterviewerAgent" },
                new ChatRole { Id = 2, Name = "User" },
                new ChatRole { Id = 3, Name = "Tool" }
            );

            modelBuilder.Entity<Notification>().Property(p => p.NotficationStatus)
                .HasConversion(
                    status => status.ToString(),
                    status => Enum.Parse<eNotificationStatus>(status)
                );

            modelBuilder.Entity<Notification>().Property(p => p.AgentType)
                .HasConversion(
                    agentType => agentType.ToString(),
                    agentType => Enum.Parse<eAgentType>(agentType)
                );

            modelBuilder.Entity<Chat>().Property(p => p.AgentType)
                .HasConversion<string>();

            modelBuilder.Entity<Canva>().Property(p => p.CanvaType)
                .HasConversion(
                 value => value.ToString(),
                 value => Enum.Parse<eCanvaType>(value)
                );

            modelBuilder.Entity<MockInterview>().Property(p => p.eMockInterviewStatus)
                .HasConversion(
                    value => value.ToString(),
                    value => Enum.Parse<eMockInterviewStatus>(value)
                );
        }


        public DbSet<Chat> Chats => Set<Chat>();
        public DbSet<ChatRole> ChatRoles => Set<ChatRole>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<Canva> Canvas => Set<Canva>();
        public DbSet<DefaultMessage> DefaultMessages => Set<DefaultMessage>();
        public DbSet<JobLevel> JobLevels => Set<JobLevel>();
        public DbSet<JobType> JobTypes => Set<JobType>();
        public DbSet<MockInterview> MockInterviews => Set<MockInterview>();
        public DbSet<MockInterviewResult> MockInterviewResults => Set<MockInterviewResult>();
        public DbSet<MockInterviewType> MockInterviewTypes => Set<MockInterviewType>();
        public DbSet<User> Users => Set<User>();
    }
}
