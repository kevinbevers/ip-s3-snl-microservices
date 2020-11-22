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

                entity.Property(e => e.QueueId)
                    .ValueGeneratedNever()
                    .HasColumnName("QueueID");

                entity.Property(e => e.GameId).HasColumnName("GameID");

                entity.Property(e => e.QueueDate).HasColumnType("datetime");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
