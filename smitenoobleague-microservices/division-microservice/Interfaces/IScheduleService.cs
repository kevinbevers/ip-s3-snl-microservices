using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using division_microservice.Models.External;
using division_microservice.Models.Internal;
using Microsoft.AspNetCore.Mvc;

namespace division_microservice.Interfaces
{
    public interface IScheduleService
    {
        //Schedule
        Task<ActionResult<Schedule>> GetScheduleByIdAsync(int scheduleID);
        Task<ActionResult<Schedule>> RemoveScheduleByIdAsync(int scheduleID);
        Task<ActionResult> CreateScheduleForDivisionAsync(ScheduleCreation values);  //int divisionID, DateTime scheduleStartDate, string scheduleName
        Task<ActionResult<IEnumerable<Schedule>>> GetAllSchedulesByDivisionIdAsync(int divisionID);
        Task<ActionResult<IEnumerable<int>>> GetAllScheduleIDsByDivisionIdAsync(int divisionID);
        Task<ActionResult<Schedule>> GetCurrentScheduleByDivisionIdAsync(int divisionID);
        Task<ActionResult> UpdateMatchUpScoreAsync(int matchupID, string scoreText);

    }
}
