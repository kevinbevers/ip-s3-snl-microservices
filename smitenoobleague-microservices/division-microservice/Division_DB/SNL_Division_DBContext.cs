using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace division_microservice.Division_DB
{
    public partial class SNL_Division_DBContext : DbContext
    {
        public SNL_Division_DBContext(DbContextOptions<SNL_Division_DBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<TableDivision> TableDivisions { get; set; }
        public virtual DbSet<TableMatchup> TableMatchups { get; set; }
        public virtual DbSet<TableSchedule> TableSchedules { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TableDivision>(entity =>
            {
                entity.HasKey(e => e.DivisionId)
                    .HasName("PRIMARY");

                entity.ToTable("TableDivision");

                entity.Property(e => e.DivisionId).HasColumnName("DivisionID");

                entity.Property(e => e.DivisionName)
                    .IsRequired()
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_general_ci");
            });

            modelBuilder.Entity<TableMatchup>(entity =>
            {
                entity.HasKey(e => e.MatchupId)
                    .HasName("PRIMARY");

                entity.ToTable("TableMatchup");

                entity.Property(e => e.MatchupId).HasColumnName("MatchupID");

                entity.Property(e => e.AwayTeamId).HasColumnName("AwayTeamID");

                entity.Property(e => e.ByeGame).HasColumnType("bit(1)");

                entity.Property(e => e.HomeTeamId).HasColumnName("HomeTeamID");

                entity.Property(e => e.ScheduleId).HasColumnName("ScheduleID");

                entity.Property(e => e.Score)
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_unicode_ci");
            });

            modelBuilder.Entity<TableSchedule>(entity =>
            {
                entity.HasKey(e => e.ScheduleId)
                    .HasName("PRIMARY");

                entity.ToTable("TableSchedule");

                entity.Property(e => e.ScheduleId).HasColumnName("ScheduleID");

                entity.Property(e => e.ScheduleDivisionId).HasColumnName("ScheduleDivisionID");

                entity.Property(e => e.ScheduleEndDate).HasColumnType("datetime");

                entity.Property(e => e.ScheduleName)
                    .IsRequired()
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.ScheduleStartDate).HasColumnType("datetime");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
