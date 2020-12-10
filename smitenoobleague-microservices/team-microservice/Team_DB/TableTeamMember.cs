using System;
using System.Collections.Generic;

#nullable disable

namespace team_microservice.Team_DB
{
    public partial class TableTeamMember
    {
        public int TeamMemberId { get; set; }
        public int TeamMemberTeamId { get; set; }
        public int TeamMemberPlayerId { get; set; }
        public int? TeamMemberRole { get; set; }
        public string TeamMemberName { get; set; }
        public int? TeamMemberPlatformId { get; set; }
        public string TeamMemberAccountId { get; set; }
        public int TeamMemberDivisionId { get; set; }
    }
}
