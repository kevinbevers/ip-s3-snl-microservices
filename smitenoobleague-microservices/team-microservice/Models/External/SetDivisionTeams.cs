using System;
using System.Collections.Generic;

namespace team_microservice.Models.External
{
    public class SetDivisionTeams
    {
        public int divisionID { get; set; }
        public List<int> teamIdList { get; set; }
    }
}
