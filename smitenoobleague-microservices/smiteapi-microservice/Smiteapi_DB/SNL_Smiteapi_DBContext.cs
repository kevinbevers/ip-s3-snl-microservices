using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace smiteapi_microservice.Smiteapi_DB
{
    public partial class SNL_Smiteapi_DBContext : DbContext
    {
        public SNL_Smiteapi_DBContext(DbContextOptions<SNL_Smiteapi_DBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<TableQueue> TableQueues { get; set; }
        public virtual DbSet<TableQueueInhouse> TableQueueInhouses { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TableQueue>(entity =>
            {
                entity.HasKey(e => e.QueueId)
                    .HasName("PRIMARY");

                entity.ToTable("TableQueue");

                entity.Property(e => e.QueueId).HasColumnName("QueueID");

                entity.Property(e => e.GameId).HasColumnName("GameID");

                entity.Property(e => e.PatchVersion)
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.QueueDate).HasColumnType("datetime");

                entity.Property(e => e.QueueState).HasColumnType("bit(1)");
            });

            modelBuilder.Entity<TableQueueInhouse>(entity =>
            {
                entity.HasKey(e => e.QueueId)
                    .HasName("PRIMARY");

                entity.Property(e => e.QueueId).HasColumnName("QueueID");

                entity.Property(e => e.GameId).HasColumnName("GameID");

                entity.Property(e => e.PatchVersion)
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.QueueDate).HasColumnType("datetime");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
