using System;
using System.Collections.Generic;

#nullable disable

namespace division_microservice.Division_DB
{
    public partial class TableSchedule
    {
        public int ScheduleId { get; set; }
        public string ScheduleName { get; set; }
        public int? ScheduleDivisionId { get; set; }
    }
}
