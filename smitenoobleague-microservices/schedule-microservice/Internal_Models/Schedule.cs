using System;
using System.Collections.Generic;

namespace division_microservice.Internal_Models
{
    public class Schedule
    {
        public int DivisionID { get; set; }
        public int ScheduleID { get; set; }
        public string ScheduleName { get; set; }
        public DateTime ScheduleStartDate { get; set; }
        public List<Matchup> Matchups { get; set; }

        public class Matchup
        {
            public int MatchupID { get; set; }
            public int WeekNumber { get; set; }
            public Team HomeTeam { get; set; }
            public Team AwayTeam { get; set; }
            public bool ByeWeek { get; set; }
        }
    }
}
