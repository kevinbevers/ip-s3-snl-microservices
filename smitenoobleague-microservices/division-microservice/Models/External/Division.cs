using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using division_microservice.Models.Internal;
using Microsoft.AspNetCore.Mvc;

namespace division_microservice.Models.External
{
    public class Division
    {
        [Required]
        public int DivisionID { get; set; }
        [Display(Name = "Division name")]
        [Required(ErrorMessage ="Division name is required")]
        [MinLength(5, ErrorMessage = "Division name is too short, a minimum of 5 characters is required")]
        [MaxLength(20, ErrorMessage = "Division name is too long, a maximum of 20 characters is allowed")]
        public string DivisionName { get; set; }
        public IEnumerable<Team> DivisionTeams { get; set; }
        public int? CurrentScheduleID { get; set; }
    }
}
