using System;
using System.Collections.Generic;

namespace division_microservice.Models.External
{
    public class Division
    {
        public int DivisionID { get; set; }
        public string DivisionName { get; set; }
        public IEnumerable<Team> DivisionTeams { get; set; }
        public int CurrentScheduleID { get; set; }
    }
}
