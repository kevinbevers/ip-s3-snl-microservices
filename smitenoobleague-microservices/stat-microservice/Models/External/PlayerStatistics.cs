using System;
using System.Collections.Generic;
using stat_microservice.Models.Internal;

namespace stat_microservice.Models.External
{
    public class PlayerStatistics
    {
        public TeamMember Player { get; set; }
        public Team Team { get; set; }

        //Game stats
        public int GamesPlayed { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }
        //Average Stats
        public int AverageKills { get; set; }
        public int AverageDeaths { get; set; }
        public int AverageAssists { get; set; }
        public int AverageDamageDealt { get; set; }
        public int AverageDamageTaken { get; set; }
        public int AverageDamageMitigated { get; set; }
        public int AverageKillParticipation { get; set; }
        //God stats
        public List<God> RecentPicks { get; set; }
        public List<GodStatistics> BestPicks { get; set; }
        public List<God> MostPicked { get; set; }
        public List<GodWithDamage> HighestDamageGods { get; set; }
        public List<God> TopBansAgainst { get; set; }
        //General Stats
        public int TotalKills { get; set; }
        public int TotalDeaths { get; set; }
        public int TotalAssists { get; set; }
        public int TotalDamageDealt { get; set; }
        public int TotalDamageTaken { get; set; }
        public int TotalDamageMitigated { get; set; }
        public int TotalHealing { get; set; }
        public int TotalDistanceTravelled { get; set; }
        public int TotalWardsPlaced { get; set; }
        public int TotalStructureDamage { get; set; }
    }
}
