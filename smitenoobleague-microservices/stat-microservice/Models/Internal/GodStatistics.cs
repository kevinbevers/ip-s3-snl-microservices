using System;
namespace stat_microservice.Models.Internal
{
    public class GodStatistics
    {
        public God God { get; set; }
        public int? TotalKills {get; set;}
        public int? TotalDeaths { get; set; }
        public int? TotalAssists { get; set; }
        public int? TotalGoldEarned { get; set; }
        public int? TotalFirstBloods { get; set; }
        public int? TotalGamesPlayed { get; set; }
        public int? TotalStructureDamage { get; set; }
        public int? TotalDamageDealt { get; set;}
        public int? TotalDamageMitigated { get; set; }
        public int? TotalDamageTaken { get; set; }
        public int? TotalWins { get; set; }
        //Highest achieved stats
        public int? HighestKillingSpree { get; set; }
        public int? HighestGoldEarned { get; set; }
        public double? HighestKda { get; set;}
        public int? HighestGpm { get; set; }
        //Average achieved stats
        public double? AverageKillParticipation { get; set; }
        public double? AverageGPM { get; set; }
        public double? AverageKda { get; set; }
        public double? AverageKills { get; set; }
        public double? AverageDeaths { get; set; }
        public double? AverageAssists { get; set; }
        public double? AverageStructureDamage { get; set; }
        public double? AverageDamageDealt { get; set; }
        public double? AverageDamageMitigated { get; set; }
        public double? AverageDamageTaken { get; set; }
    }
}
