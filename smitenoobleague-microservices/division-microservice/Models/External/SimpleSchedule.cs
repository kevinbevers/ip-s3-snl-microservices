using System;
using System.ComponentModel.DataAnnotations;

namespace division_microservice.Models.External
{
    public class SimpleSchedule
    {
        [Required]
        public int ScheduleID { get; set; }
        [Required]
        [MinLength(6, ErrorMessage = "Schedule name is too short, a minimum of 6 characters is required")]
        [MaxLength(20, ErrorMessage = "Schedule name is too long, a maximum of 20 characters is allowed")]
        public string ScheduleName { get; set; }
    }
}
