using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using division_microservice.Classes;
using division_microservice.Models.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using division_microservice.Division_DB;
using division_microservice.Models.External;
using division_microservice.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace division_microservice.Controllers
{
    [Route("[controller]")]
    public class ScheduleController : Controller
    {
        private readonly IScheduleService _scheduleService;

        public ScheduleController(IScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        // GET:  /all-bydivisionid/{divisionID}
        [HttpGet("all-bydivisionid/{divisionID}")]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetByDivisionID(int divisionID)
        {
            return ModelState.IsValid ? await _scheduleService.GetAllSchedulesByDivisionIdAsync(divisionID) : BadRequest(ModelState);
        }
        // GET:  /allids-bydivisionid/{divisionID}
        [HttpGet("allids&names-bydivisionid/{divisionID}")]
        public async Task<ActionResult<IEnumerable<SimpleSchedule>>> GetListOfScheduleIds(int divisionID)
        {
            return ModelState.IsValid ? await _scheduleService.GetSimpleListOfAllSchedulesByDivisionIdAsync(divisionID) : BadRequest(ModelState);
        }

        // GET /byscheduleid/{scheduleID}
        [HttpGet("byscheduleid/{scheduleID}")]
        public async Task<ActionResult<Schedule>> GetByScheduleID(int scheduleID)
        {
            return ModelState.IsValid ? await _scheduleService.GetScheduleByIdAsync(scheduleID) : BadRequest(ModelState);
        }

        // GET:  /currentschedulebydivisionid/{divisionID}
        [HttpGet("currentschedulebydivisionid/{divisionID}")]
        public async Task<ActionResult<Schedule>> GetCurrentScheduleByDivisionID(int divisionID)
        {
            return ModelState.IsValid ? await _scheduleService.GetCurrentScheduleByDivisionIdAsync(divisionID) : BadRequest(ModelState);
        }

        // DELETE /schedule/{scheduleID}
        [HttpDelete("byscheduleid/{scheduleID}")]
        public async Task<ActionResult<Schedule>> Delete(int scheduleID)
        {
            return ModelState.IsValid ? await _scheduleService.RemoveScheduleByIdAsync(scheduleID) : BadRequest(ModelState);
        }

        // PUT /schedule/{scheduleID}
        [HttpPut]
        public async Task<ActionResult<Schedule>> Put([FromBody] SimpleSchedule values)
        {
            return ModelState.IsValid ? await _scheduleService.UpdateScheduleForDivisionAsync(values) : BadRequest(ModelState);
        }

        // POST schedule/ scheduleSubmission{Name, Division, startDate}
        [HttpPost]
        public async Task<ActionResult> PostAsync([FromBody] ScheduleCreation values)
        {
            return ModelState.IsValid ? await _scheduleService.CreateScheduleForDivisionAsync(values) :  BadRequest(ModelState);
        }

        // POST schedule/updatematchupscore updateMatchScore{MatchupID, ScoreText}
        [HttpPost("updatematchupscore")]
        public async Task<ActionResult> PostMatchupScore([FromBody] UpdateMatchScore updateMatchScore)
        {
            return ModelState.IsValid ? await _scheduleService.UpdateMatchUpScoreAsync(updateMatchScore.MatchupID, updateMatchScore.ScoreText) : BadRequest(ModelState);
        }
    }
}
