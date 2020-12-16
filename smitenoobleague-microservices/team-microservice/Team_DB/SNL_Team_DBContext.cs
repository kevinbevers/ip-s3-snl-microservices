using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace team_microservice.Team_DB
{
    public partial class SNL_Team_DBContext : DbContext
    {

        public SNL_Team_DBContext(DbContextOptions<SNL_Team_DBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<TableRole> TableRoles { get; set; }
        public virtual DbSet<TableTeam> TableTeams { get; set; }
        public virtual DbSet<TableTeamMember> TableTeamMembers { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TableRole>(entity =>
            {
                entity.HasKey(e => e.RoleId)
                    .HasName("PRIMARY");

                entity.ToTable("TableRole");

                entity.Property(e => e.RoleId).HasColumnName("RoleID");

                entity.Property(e => e.RoleName)
                    .IsRequired()
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_unicode_ci");
            });

            modelBuilder.Entity<TableTeam>(entity =>
            {
                entity.HasKey(e => e.TeamId)
                    .HasName("PRIMARY");

                entity.ToTable("TableTeam");

                entity.Property(e => e.TeamId).HasColumnName("TeamID");

                entity.Property(e => e.TeamCaptainId).HasColumnName("TeamCaptainID");

                entity.Property(e => e.TeamDivisionId).HasColumnName("TeamDivisionID");

                entity.Property(e => e.TeamLogoPath)
                    .HasColumnType("varchar(300)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_unicode_ci");

                entity.Property(e => e.TeamName)
                    .IsRequired()
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_unicode_ci");
            });

            modelBuilder.Entity<TableTeamMember>(entity =>
            {
                entity.HasKey(e => e.TeamMemberId)
                    .HasName("PRIMARY");

                entity.ToTable("TableTeamMember");

                entity.Property(e => e.TeamMemberId).HasColumnName("TeamMemberID");

                entity.Property(e => e.TeamMemberAccountId)
                    .HasColumnType("varchar(45)")
                    .HasColumnName("TeamMemberAccountID")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_unicode_ci");

                entity.Property(e => e.TeamMemberDivisionId).HasColumnName("TeamMemberDivisionID");

                entity.Property(e => e.TeamMemberName)
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_unicode_ci");

                entity.Property(e => e.TeamMemberPlatformId).HasColumnName("TeamMemberPlatformID");

                entity.Property(e => e.TeamMemberPlayerId).HasColumnName("TeamMemberPlayerID");

                entity.Property(e => e.TeamMemberTeamId).HasColumnName("TeamMemberTeamID");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
