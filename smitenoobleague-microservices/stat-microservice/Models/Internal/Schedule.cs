using System;
using System.Collections.Generic;

namespace stat_microservice.Models.Internal
{
    public class Schedule
    {
        public int DivisionID { get; set; }
        public int ScheduleID { get; set; }
        public string ScheduleName { get; set; }
        public DateTime ScheduleStartDate { get; set; }
        public int CurrentWeek { get; set; }
        public IEnumerable<Matchup> Matchups { get; set; }
    }
}
