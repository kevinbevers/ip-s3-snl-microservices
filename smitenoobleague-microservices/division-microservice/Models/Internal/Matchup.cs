using System;
namespace division_microservice.Models.Internal
{
    public class Matchup
    {
        public int MatchupID { get; set; }
        public int WeekNumber { get; set; }
        public Team HomeTeam { get; set; }
        public Team AwayTeam { get; set; }
        public bool ByeWeek { get; set; }
        public string Score { get; set; }
    }
}
