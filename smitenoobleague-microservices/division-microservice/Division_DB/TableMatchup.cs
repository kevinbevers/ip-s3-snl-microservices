using System;
using System.Collections.Generic;

#nullable disable

namespace division_microservice.Division_DB
{
    public partial class TableMatchup
    {
        public int MatchupId { get; set; }
        public int ScheduleId { get; set; }
        public int WeekNumber { get; set; }
        public int HomeTeamId { get; set; }
        public int? AwayTeamId { get; set; }
        public sbyte ByeGame { get; set; }
    }
}
