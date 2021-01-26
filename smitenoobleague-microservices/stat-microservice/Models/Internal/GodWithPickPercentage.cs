using System;
namespace stat_microservice.Models.Internal
{
    public class GodWithPickPercentage : God
    {
        public int? TimesPlayed { get; set; }
        public int? TimesBanned { get; set; }
        public int? TimesPlayedInSNL { get; set; }
        public int? TimesBannedInSNL { get; set; }
    }
}
