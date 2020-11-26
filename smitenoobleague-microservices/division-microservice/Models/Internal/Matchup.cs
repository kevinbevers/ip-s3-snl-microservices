using System;
namespace division_microservice.Models.Internal
{
    public class Matchup
    {
        public int MatchupID { get; set; }
        public int WeekNumber { get; set; }
        public MatchupTeam HomeTeam { get; set; }
        public MatchupTeam AwayTeam { get; set; }
        public bool ByeWeek { get; set; }
    }
}
