using System;
namespace inhouse_microservice.Models.Internal
{
    public class LeaderboardEntry
    {
        public int? Score { get; set; }
        public LeaderboardPlayer Player { get; set; } 
    }
}
