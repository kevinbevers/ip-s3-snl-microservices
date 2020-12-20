using System;
using System.Collections.Generic;

namespace team_microservice.Models.External
{
    public class TeamWithDetails : Team
    {
        public List<TeamMember> TeamMembers { get; set; }
    }
}
