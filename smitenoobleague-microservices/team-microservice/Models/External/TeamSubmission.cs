﻿using System;
using System.ComponentModel.DataAnnotations;

namespace team_microservice.Models.External
{
    public class TeamSubmission
    {
        public int TeamID { get; set; }
        [Display(Name = "Team name")]
        [Required(ErrorMessage = "Team name is required")]
        [MinLength(5, ErrorMessage = "Team name is too short, a minimum of 5 characters is required")]
        [MaxLength(20, ErrorMessage = "Team name is too long, a maximum of 25 characters is allowed")]
        public string TeamName { get; set; }
        public int? TeamDivisionID { get; set; }
        public CaptainData Captain { get; set; }

        public class CaptainData
        {
            public string TeamCaptainAccountID { get; set; }
            public int? TeamCaptainPlayerID { get; set; }
            public string TeamCaptainPlayerName { get; set; }
            public int? TeamCaptainPlatformID { get; set; }
            public int? TeamCaptainRoleID { get; set; }
        }
    }
}
