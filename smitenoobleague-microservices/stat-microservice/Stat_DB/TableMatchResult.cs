using System;
using System.Collections.Generic;

#nullable disable

namespace stat_microservice.Stat_DB
{
    public partial class TableMatchResult
    {
        public int MatchResultId { get; set; }
        public int? GameId { get; set; }
        public int? ScheduleMatchUpId { get; set; }
        public int? WinningTeamId { get; set; }
        public int? LosingTeamId { get; set; }
        public DateTime? DatePlayed { get; set; }
        public int? HomeTeamId { get; set; }
        public int? AwayTeamId { get; set; }
        public int? GamedurationInSeconds { get; set; }
    }
}
