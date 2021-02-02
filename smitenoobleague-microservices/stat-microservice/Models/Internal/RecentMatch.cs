using System;
namespace stat_microservice.Models.Internal
{
    public class RecentMatch
    {
        public int? MatchupID { get; set; }
        public DateTime? DatePlayed { get; set; }
        public bool? Won { get; set; }
        public bool? Lost { get; set; }
        public Team Opponent { get; set; }
        public int? GamesPlayed { get; set; }
    }
}
