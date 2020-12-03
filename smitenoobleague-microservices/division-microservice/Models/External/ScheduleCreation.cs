using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace division_microservice.Models.External
{
    public class ScheduleCreation
    {
        [Required]
        [Remote(action: "DivisionExists", controller: "Validation")]
        public int DivisionID { get; set; }
        [Required]
        [MinLength(6, ErrorMessage = "Schedule name is too short, a minimum of {0} characters is required")]
        [MaxLength(20, ErrorMessage = "Schedule name is too long, a maximum of {0} characters is allowed")]
        public string ScheduleName { get; set; }
        [Required]
        [DateRange( ErrorMessage = "ScheduleStartDate should be between Today and 1 year from now.")]
        public DateTime ScheduleStartDate { get; set; }
    }

    public class DateRange : RangeAttribute
    {
        public DateRange()
          : base(typeof(DateTime), DateTime.Today.ToShortDateString(), DateTime.Today.AddYears(1).ToShortDateString()) { }
    }
}
