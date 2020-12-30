using System;
using System.Collections.Generic;

#nullable disable

namespace stat_microservice.Stat_DB
{
    public partial class TableStanding
    {
        public int StandingId { get; set; }
        public int? DivisionId { get; set; }
        public int? ScheduleId { get; set; }
        public int? StandingScore { get; set; }
        public int? StandingWins { get; set; }
        public int? StandingLosses { get; set; }
    }
}
