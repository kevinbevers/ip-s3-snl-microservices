using System;
namespace stat_microservice.Models.External
{
    public class MatchHistory
    {
        public int? MatchupID { get; set; }
        public string TotalMatchDuration { get; set; }
        public int HomeTeamScore { get; set; }
        public int AwayTeamScore { get; set; }
        public DateTime DatePlayed {get; set;}
    }
}
