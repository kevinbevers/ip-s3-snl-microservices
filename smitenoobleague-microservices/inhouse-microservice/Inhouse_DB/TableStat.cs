using System;
using System.Collections.Generic;

#nullable disable

namespace inhouse_microservice.Inhouse_DB
{
    public partial class TableStat
    {
        public int StatId { get; set; }
        public int? GameId { get; set; }
        public DateTime? MatchPlayedDate { get; set; }
        public int? PlayerId { get; set; }
        public string PlayerName { get; set; }
        public int? PlayerPlatformId { get; set; }
        public int? GodPlayedId { get; set; }
        public string PatchNumber { get; set; }
        public bool? WinStatus { get; set; }
        public int? TotalKillsTeam { get; set; }
        public int? IgTaskforce { get; set; }
        public int? IgMatchLengthInSeconds { get; set; }
        public string IgGodName { get; set; }
        public int? IgPlayerLevel { get; set; }
        public int? IgKills { get; set; }
        public int? IgDeaths { get; set; }
        public int? IgAssists { get; set; }
        public int? IgGoldEarned { get; set; }
        public int? IgGpm { get; set; }
        public int? IgRelic1Id { get; set; }
        public int? IgRelic2Id { get; set; }
        public int? IgItem1Id { get; set; }
        public int? IgItem2Id { get; set; }
        public int? IgItem3Id { get; set; }
        public int? IgItem4Id { get; set; }
        public int? IgItem5Id { get; set; }
        public int? IgItem6Id { get; set; }
        public int? IgDamageDealt { get; set; }
        public int? IgDamageTaken { get; set; }
        public int? IgDamageMitigated { get; set; }
        public int? IgHealing { get; set; }
        public int? IgMinionDamage { get; set; }
        public int? IgDistanceTraveled { get; set; }
        public int? IgBan1Id { get; set; }
        public int? IgBan2Id { get; set; }
        public int? IgBan3Id { get; set; }
        public int? IgBan4Id { get; set; }
        public int? IgBan5Id { get; set; }
        public int? IgBan6Id { get; set; }
        public int? IgBan7Id { get; set; }
        public int? IgBan8Id { get; set; }
        public int? IgBan9Id { get; set; }
        public int? IgBan10Id { get; set; }
        public int? IgFireGiantsKilled { get; set; }
        public int? IgGoldFuriesKilled { get; set; }
        public int? IgWardsPlaced { get; set; }
        public int? IgStructureDamage { get; set; }
        public int? IgTowersDestroyed { get; set; }
        public string IgRegion { get; set; }
        public bool? IgFirstBlood { get; set; }
        public int? IgHighestMultiKill { get; set; }
        public int? IgObjectiveAssists { get; set; }
        public int? IgPhoenixesDestroyed { get; set; }
        public int? IgTimeSpentDeathInSeconds { get; set; }
        public int? IgPentas { get; set; }
        public int? IgQuadras { get; set; }
        public int? IgTriples { get; set; }
        public int? IgDoubles { get; set; }
        public int? IgKillingSpree { get; set; }
    }
}
