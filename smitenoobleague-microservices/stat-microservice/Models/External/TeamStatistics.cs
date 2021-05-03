using System;
using System.Collections.Generic;
using stat_microservice.Models.Internal;

namespace stat_microservice.Models.External
{
    public class TeamStatistics
    {
        public TeamWithDetails Team { get; set; }
        public string DivisionName { get; set; }

        //Game stats
        public int GamesPlayed { get; set; }
        public int Losses { get; set; }
        public int Wins { get; set; }
        //God stats
        public List<GodWithTimesPlayed> MostPlayed { get; set; }
        public List<God> MostBanned { get; set; }
        public TeamMember StarPlayer { get; set; }
        //General Stats
        public int TotalKills { get; set; }
        public int TotalDeaths { get; set; }
        public int TotalAssists { get; set; }
        public int TotalDamageDealt { get; set; }
        public int TotalDamageTaken { get; set; }
        public int TotalDamageMitigated { get; set; }
        public int TotalHealing { get; set; }
        public int TotalWardsPlaced { get; set; }
        public int TotalStructureDamage { get; set; }
        //recent matches
        public List<int> RecentPerformanceScore { get; set; }
        public List<RecentMatch> RecentMatches { get; set; }
        public int? MatchHistoryNumberOfPages { get; set; }
    }
}
