using System;
using System.Collections.Generic;

namespace smiteapi_microservice.Models.Internal
{
    public class TeamWithDetails : Team
    {
        public List<TeamMember> TeamMembers { get; set; }
    }
}
