using System;
using System.Collections.Generic;
using stat_microservice.Models.Internal;
namespace stat_microservice.Models.External
{
    public class ScheduleStandingList
    {
        public int? scheduleID { get; set; }
        public List<Standing> Standings { get; set; }
    }
}
