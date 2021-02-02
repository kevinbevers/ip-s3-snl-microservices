using System;
namespace stat_microservice.Models.Internal
{
    public class ScheduledMatch
    {
        public Matchup matchup;
        public int ScheduleID { get; set; }
        public DateTime ScheduleStartDate { get; set; }
    }
}
