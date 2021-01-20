using System;
using System.Collections.Generic;
using stat_microservice.Models.Internal;

namespace stat_microservice.Models.External
{
    public class MatchHistoryDetails
    {
        public int? MatchupID { get; set; }
        public List<MatchDataWithRole> MatchResults { get; set; }
    }
}
