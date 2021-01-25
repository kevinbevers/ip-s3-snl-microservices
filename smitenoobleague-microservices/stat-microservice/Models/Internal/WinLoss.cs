using System;
namespace stat_microservice.Models.Internal
{
    public class WinLoss
    {
        public int? MatchupID { get; set; }
        public bool? Won { get; set; }
        public DateTime? DatePlayed { get; set; }

    }
}
