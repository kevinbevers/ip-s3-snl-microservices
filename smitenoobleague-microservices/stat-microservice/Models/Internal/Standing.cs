using System;
using System.Collections.Generic;

namespace stat_microservice.Models.Internal
{
    public class Standing
    {
        public Team Team { get; set; }
        public int? StandingScore { get; set; }
        public int? StandingWins { get; set; }
        public int? StandingLosses { get; set; }
        public List<WinLoss> Last5Results { get; set; }
    }
}
