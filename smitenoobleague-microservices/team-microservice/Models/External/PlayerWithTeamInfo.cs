﻿using System;
namespace team_microservice.Models.External
{
    public class PlayerWithTeamInfo
    {
        public TeamMember Player { get; set; }
        public Team Team { get; set; }

    }
}
