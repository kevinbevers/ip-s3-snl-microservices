using System;
using stat_microservice.Models.Internal;

namespace stat_microservice.Models.Internal
{
    public class PlayerWithTeamInfo
    {
        public TeamMember Player { get; set; }
        public Team Team { get; set; }

    }
}
