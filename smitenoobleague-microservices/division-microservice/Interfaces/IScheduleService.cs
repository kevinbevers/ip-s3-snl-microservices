using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using division_microservice.Models.Internal;
using Microsoft.AspNetCore.Mvc;

namespace division_microservice.Interfaces
{
    public interface IScheduleService
    {
        //Schedule
        Task<ActionResult<Schedule>> GetScheduleByIdAsync(int divisionID, int scheduleID);
        Task<ActionResult<Schedule>> RemoveScheduleByIdAsync(int divisionID, int scheduleID);
        Task<IActionResult> CreateScheduleForDivisionAsync(int divisionID, DateTime scheduleStartDate, string scheduleName);
        Task<ActionResult<List<Schedule>>> GetAllSchedulesByDivisionIdAsync(int divisionID);
    }
}
