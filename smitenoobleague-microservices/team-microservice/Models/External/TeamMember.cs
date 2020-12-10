using System;
using team_microservice.Models.Internal;

namespace team_microservice.Models.External
{
    public class TeamMember
    {
        public int TeamMemberID { get; set; }
        public string TeamMemberName { get; set; }
        public Role TeamMemberRole { get; set; }
        public bool TeamCaptain { get; set; }
        //Smite api data
        public string TeamMemberPlatform { get; set; }
        public int PlayerID { get; set; }
    }
}
