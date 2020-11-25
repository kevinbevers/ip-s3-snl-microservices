using System;
using System.Collections.Generic;

namespace division_microservice.Models.Internal
{
    public class Schedule
    {
        public int DivisionID { get; set; }
        public int ScheduleID { get; set; }
        public string ScheduleName { get; set; }
        public DateTime ScheduleStartDate { get; set; }
        public List<Matchup> Matchups { get; set; }
    }
}
