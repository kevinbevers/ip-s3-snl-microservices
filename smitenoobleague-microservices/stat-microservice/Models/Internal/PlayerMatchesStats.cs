using System;
using System.Collections.Generic;

namespace stat_microservice.Models.Internal
{
    public class PlayerMatchesStats
    {
        public int? GameId { get; set; }
        public int? GodPlayedId { get; set; }
        public int? TotalKillsPlayerTeam { get; set; }
        public List<int?> BansEnemyTeam {get; set;}
    }
}
