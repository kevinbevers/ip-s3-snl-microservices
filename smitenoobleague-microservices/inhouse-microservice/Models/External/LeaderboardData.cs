using System;
using System.Collections.Generic;
using inhouse_microservice.Models.Internal;

namespace inhouse_microservice.Models.External
{
    public class LeaderboardData
    {
        public List<LeaderboardEntry> Kills { get; set; }
        public List<LeaderboardEntry> Assists { get; set; }
        public List<LeaderboardEntry> Deaths { get; set; }
        public List<LeaderboardEntry> DamageDealt { get; set; }
        public List<LeaderboardEntry> DamageMitigated { get; set; }
        public List<LeaderboardEntry_Double> KillParticipation { get; set; }
        public List<LeaderboardEntry> DamageTaken { get; set; }
        public List<LeaderboardEntry> Healing { get; set; }
        public List<LeaderboardEntry> Top10DamageAndRemainingInPercentage { get; set; }
        public List<LeaderboardEntry_Double> Top5KdaPlayers { get; set; }
    }
}
