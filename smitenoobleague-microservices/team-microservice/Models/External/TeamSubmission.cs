using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace team_microservice.Models.External
{
    public class TeamSubmission
    {
        public int TeamID { get; set; }
        [Display(Name = "Team name")]
        [Required(ErrorMessage = "Team name is required")]
        [MinLength(5, ErrorMessage = "Team name is too short, a minimum of 5 characters is required")]
        [MaxLength(21, ErrorMessage = "Team name is too long, a maximum of 21 characters is allowed")]
        public string TeamName { get; set; }
        public IFormFile TeamLogo { get; set; }
    }
}
