using System;
namespace stat_microservice.Models.Internal
{
    public class LeaderboardEntry_Double
    {
        public double? Score { get; set; }
        public LeaderboardPlayer Player { get; set; }
    }
}
