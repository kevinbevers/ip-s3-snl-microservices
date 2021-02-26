using System;
using System.Collections.Generic;
using inhouse_microservice.Models.Internal;

namespace inhouse_microservice.Models.External
{
    public class MatchHistoryDetails
    {
        public int? GameID { get; set; }
        public MatchDataWithExtras MatchResult { get; set; }
    }
}
