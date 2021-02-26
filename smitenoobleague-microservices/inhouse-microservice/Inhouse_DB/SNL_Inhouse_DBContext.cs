using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace inhouse_microservice.Inhouse_DB
{
    public partial class SNL_Inhouse_DBContext : DbContext
    {
        public SNL_Inhouse_DBContext(DbContextOptions<SNL_Inhouse_DBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<TableGodDetail> TableGodDetails { get; set; }
        public virtual DbSet<TableItemDetail> TableItemDetails { get; set; }
        public virtual DbSet<TableStat> TableStats { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TableGodDetail>(entity =>
            {
                entity.HasKey(e => e.GodId)
                    .HasName("PRIMARY");

                entity.ToTable("TableGodDetail");

                entity.Property(e => e.GodId)
                    .ValueGeneratedNever()
                    .HasColumnName("GodID");

                entity.Property(e => e.GodIconUrl)
                    .HasColumnType("varchar(150)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.GodName)
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<TableItemDetail>(entity =>
            {
                entity.HasKey(e => e.ItemId)
                    .HasName("PRIMARY");

                entity.ToTable("TableItemDetail");

                entity.Property(e => e.ItemId)
                    .ValueGeneratedNever()
                    .HasColumnName("ItemID");

                entity.Property(e => e.ItemDescription)
                    .HasColumnType("varchar(300)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.ItemIconUrl)
                    .HasColumnType("varchar(150)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.ItemName)
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<TableStat>(entity =>
            {
                entity.HasKey(e => e.StatId)
                    .HasName("PRIMARY");

                entity.ToTable("TableStat");

                entity.Property(e => e.StatId).HasColumnName("StatID");

                entity.Property(e => e.GameId).HasColumnName("GameID");

                entity.Property(e => e.GodPlayedId).HasColumnName("GodPlayedID");

                entity.Property(e => e.IgAssists).HasColumnName("IG_Assists");

                entity.Property(e => e.IgBan10Id).HasColumnName("IG_Ban10ID");

                entity.Property(e => e.IgBan1Id).HasColumnName("IG_Ban1ID");

                entity.Property(e => e.IgBan2Id).HasColumnName("IG_Ban2ID");

                entity.Property(e => e.IgBan3Id).HasColumnName("IG_Ban3ID");

                entity.Property(e => e.IgBan4Id).HasColumnName("IG_Ban4ID");

                entity.Property(e => e.IgBan5Id).HasColumnName("IG_Ban5ID");

                entity.Property(e => e.IgBan6Id).HasColumnName("IG_Ban6ID");

                entity.Property(e => e.IgBan7Id).HasColumnName("IG_Ban7ID");

                entity.Property(e => e.IgBan8Id).HasColumnName("IG_Ban8ID");

                entity.Property(e => e.IgBan9Id).HasColumnName("IG_Ban9ID");

                entity.Property(e => e.IgDamageDealt).HasColumnName("IG_DamageDealt");

                entity.Property(e => e.IgDamageMitigated).HasColumnName("IG_DamageMitigated");

                entity.Property(e => e.IgDamageTaken).HasColumnName("IG_DamageTaken");

                entity.Property(e => e.IgDeaths).HasColumnName("IG_Deaths");

                entity.Property(e => e.IgDistanceTraveled).HasColumnName("IG_DistanceTraveled");

                entity.Property(e => e.IgDoubles).HasColumnName("IG_Doubles");

                entity.Property(e => e.IgFireGiantsKilled).HasColumnName("IG_FireGiantsKilled");

                entity.Property(e => e.IgFirstBlood).HasColumnName("IG_FirstBlood");

                entity.Property(e => e.IgGodName)
                    .HasColumnType("varchar(45)")
                    .HasColumnName("IG_GodName")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.IgGoldEarned).HasColumnName("IG_GoldEarned");

                entity.Property(e => e.IgGoldFuriesKilled).HasColumnName("IG_GoldFuriesKilled");

                entity.Property(e => e.IgGpm).HasColumnName("IG_GPM");

                entity.Property(e => e.IgHealing).HasColumnName("IG_Healing");

                entity.Property(e => e.IgHighestMultiKill).HasColumnName("IG_HighestMultiKill");

                entity.Property(e => e.IgItem1Id).HasColumnName("IG_Item1ID");

                entity.Property(e => e.IgItem2Id).HasColumnName("IG_Item2ID");

                entity.Property(e => e.IgItem3Id).HasColumnName("IG_Item3ID");

                entity.Property(e => e.IgItem4Id).HasColumnName("IG_item4ID");

                entity.Property(e => e.IgItem5Id).HasColumnName("IG_Item5ID");

                entity.Property(e => e.IgItem6Id).HasColumnName("IG_Item6ID");

                entity.Property(e => e.IgKillingSpree).HasColumnName("IG_KillingSpree");

                entity.Property(e => e.IgKills).HasColumnName("IG_Kills");

                entity.Property(e => e.IgMatchLengthInSeconds).HasColumnName("IG_MatchLengthInSeconds");

                entity.Property(e => e.IgMinionDamage).HasColumnName("IG_MinionDamage");

                entity.Property(e => e.IgObjectiveAssists).HasColumnName("IG_ObjectiveAssists");

                entity.Property(e => e.IgPentas).HasColumnName("IG_Pentas");

                entity.Property(e => e.IgPhoenixesDestroyed).HasColumnName("IG_PhoenixesDestroyed");

                entity.Property(e => e.IgPlayerLevel).HasColumnName("IG_PlayerLevel");

                entity.Property(e => e.IgQuadras).HasColumnName("IG_Quadras");

                entity.Property(e => e.IgRegion)
                    .HasColumnType("varchar(45)")
                    .HasColumnName("IG_Region")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.IgRelic1Id).HasColumnName("IG_Relic1ID");

                entity.Property(e => e.IgRelic2Id).HasColumnName("IG_Relic2ID");

                entity.Property(e => e.IgStructureDamage).HasColumnName("IG_StructureDamage");

                entity.Property(e => e.IgTaskforce).HasColumnName("IG_Taskforce");

                entity.Property(e => e.IgTimeSpentDeathInSeconds).HasColumnName("IG_TimeSpentDeathInSeconds");

                entity.Property(e => e.IgTowersDestroyed).HasColumnName("IG_TowersDestroyed");

                entity.Property(e => e.IgTriples).HasColumnName("IG_Triples");

                entity.Property(e => e.IgWardsPlaced).HasColumnName("IG_WardsPlaced");

                entity.Property(e => e.MatchPlayedDate).HasColumnType("datetime");

                entity.Property(e => e.PatchNumber)
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.PlayerId).HasColumnName("PlayerID");

                entity.Property(e => e.PlayerName)
                    .HasColumnType("varchar(45)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.PlayerPlatformId).HasColumnName("PlayerPlatformID");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
