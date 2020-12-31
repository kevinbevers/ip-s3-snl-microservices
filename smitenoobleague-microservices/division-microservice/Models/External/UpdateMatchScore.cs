using System;
namespace division_microservice.Models.External
{
    public class UpdateMatchScore
    {
        public int MatchupID { get; set; }
        public string ScoreText { get; set; }
    }
}
