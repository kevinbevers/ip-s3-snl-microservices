using System;
using System.Collections.Generic;

#nullable disable

namespace stat_microservice.Stat_DB
{
    public partial class TableStat
    {
        public int StatId { get; set; }
        public int? GameId { get; set; }
        public DateTime? MatchPlayedDate { get; set; }
        public int? TeamId { get; set; }
        public int? DivisionId { get; set; }
        public int? RoleId { get; set; }
        public int? PlayerId { get; set; }
        public bool? PlayerIsFill { get; set; }
        public int? GodPlayedId { get; set; }
        public string PatchNumber { get; set; }
        public bool? WinStatus { get; set; }
        public int? IgTaskforce { get; set; }
        public int? IgMatchLengthInSeconds { get; set; }
        public string IgGodName { get; set; }
        public string IgPlayerLevel { get; set; }
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
    }
}
