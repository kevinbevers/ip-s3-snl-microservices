using System;
using System.Collections.Generic;

namespace stat_microservice.Models.Internal
{
    public class TeamMatchesStats
    {
        public int? GameId { get; set; }
        public int? MatchupId { get; set; }
        public int? OpponentId { get; set; }
        public DateTime? DatePlayed { get; set; }
        public int? GoldEarnedInMatch { get; set; }
        public int? TotalAssistsInMatch { get; set; }
        public int? MatchDurationInSeconds { get; set; }
        public int? TotalDeathsInMatch { get; set; }
        public bool? WonMatch { get; set; }
        public int? TotalDamageDealtInMatch { get; set; }
        public int? TotalObjectivesTakenInMatch { get; set; }
        public int? TotalKillsTeam { get; set; }
        //public List<int?> GodsPlayed { get; set; }
        public List<int?> BansEnemyTeam {get; set;}
        public List<int?> BansTeam { get; set; }
    }
}
