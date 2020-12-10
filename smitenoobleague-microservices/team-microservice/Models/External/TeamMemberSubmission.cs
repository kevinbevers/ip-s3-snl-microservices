using System;
using System.ComponentModel.DataAnnotations;
using team_microservice.Models.Internal;

namespace team_microservice.Models.External
{
    public class TeamMemberSubmission
    {
        public int? TeamMemberID { get; set; }
        [Required]
        public int PlayerID { get; set; }
        [Required]
        public int PlatformID { get; set; }
        [Required]
        public int TeamID { get; set; }
        [Required]
        public string PlayerName { get; set; }
        [Required]
        public int RoleID { get; set; }
    }
}
