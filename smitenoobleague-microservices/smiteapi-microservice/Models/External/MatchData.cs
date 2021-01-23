﻿using System;
using System.Collections.Generic;
using smiteapi_microservice.Models.Internal;

namespace smiteapi_microservice.Models.External
{
    public class MatchData
    {
        //public bool? sendEmail { get; set; } //fill this when saving the match so we can extract if we need to send an email or not, used when match is instantly available
        public string patchNumber { get; set; }
        public int? GameID { get; set; }
        public DateTime EntryDate { get; set; }
        public int? MatchDurationInSeconds { get; set; } //use timespan to convert to actual time for representation
        public string MatchDuration { get; set; }
        public List<PlayerStat> Winners { get; set; }
        public List<PlayerStat> Losers { get; set; }
        public List<God> BannedGods { get; set; }
        public int? GamemodeID { get; set; } //queue_id. 429 = custom conquest. 426 normal conquest
        //return message for possible errors. ex. match not available
        public object ret_msg { get; set; } 
    }
}
