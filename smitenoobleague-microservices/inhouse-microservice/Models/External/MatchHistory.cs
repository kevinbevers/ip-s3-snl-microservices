using System;
using System.Collections.Generic;
using inhouse_microservice.Models.Internal;

namespace inhouse_microservice.Models.External
{
    public class MatchHistory
    {
        public int? GameID { get; set; }
        public string TotalMatchDuration { get; set; }
        public DateTime? DatePlayed {get; set;}
        public List<Player> OrderPlayers { get; set; }
        public List<Player> ChaosPlayers { get; set; }
        public bool homeWin { get; set; }
    }
}
