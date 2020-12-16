using System;
using System.Collections.Generic;

#nullable disable

namespace team_microservice.Team_DB
{
    public partial class TableTeam
    {
        public int TeamId { get; set; }
        public int? TeamDivisionId { get; set; }
        public string TeamName { get; set; }
        public int? TeamCaptainId { get; set; }
        public string TeamLogoPath { get; set; }
    }
}
