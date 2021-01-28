using System;
using System.Collections.Generic;
using stat_microservice.Models.Internal;

namespace stat_microservice.Models.External
{
    public class TeamPickPercentages
    {
        public Team Team { get; set; }

        //Pick & Ban percentages
        public int TotalGamesPlayed { get; set; }
        public int TotalGamesPlayedInSNL { get; set; }
        public List<GodWithPickPercentage> Gods { get; set; }
    }
}
