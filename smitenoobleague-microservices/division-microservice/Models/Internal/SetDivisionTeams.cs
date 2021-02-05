using System;
using System.Collections.Generic;

namespace division_microservice.Models.Internal
{
    public class SetDivisionTeams
    {
        public int divisionID { get; set; }
        public List<int> teamIdList { get; set; }
    }
}
