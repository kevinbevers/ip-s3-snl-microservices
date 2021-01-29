using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace news_microservice.News_DB
{
    public partial class SNL_News_DBContext : DbContext
    {
        public SNL_News_DBContext(DbContextOptions<SNL_News_DBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<ArticleTable> ArticleTables { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ArticleTable>(entity =>
            {
                entity.HasKey(e => e.ArticleId)
                    .HasName("PRIMARY");

                entity.ToTable("ArticleTable");

                entity.Property(e => e.ArticleId)
                    .ValueGeneratedNever()
                    .HasColumnName("ArticleID");

                entity.Property(e => e.ArticleContent)
                    .HasColumnType("varchar(1000)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_unicode_ci");

                entity.Property(e => e.ArticleDescription)
                    .HasColumnType("varchar(300)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_unicode_ci");

                entity.Property(e => e.ArticleTitle)
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_unicode_ci");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
