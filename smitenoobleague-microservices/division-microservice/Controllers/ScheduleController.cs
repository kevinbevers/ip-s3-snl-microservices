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

        // GET:  /schedule/{divisionID}
        [HttpGet("all-bydivisionid/{divisionID}")]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetByDivisionID(int divisionID)
        {
            return ModelState.IsValid ? await _scheduleService.GetAllSchedulesByDivisionIdAsync(divisionID) : BadRequest(ModelState);
        }
        // GET:  /schedule/{divisionID}
        [HttpGet("allids-bydivisionid/{divisionID}")]
        public async Task<ActionResult<IEnumerable<int>>> GetListOfScheduleIds(int divisionID)
        {
            return ModelState.IsValid ? await _scheduleService.GetAllScheduleIDsByDivisionIdAsync(divisionID) : BadRequest(ModelState);
        }

        // GET /schedule/{scheduleID}
        [HttpGet("byscheduleid/{scheduleID}")]
        public async Task<ActionResult<Schedule>> GetByScheduleID(int scheduleID)
        {
            return ModelState.IsValid ? await _scheduleService.GetScheduleByIdAsync(scheduleID) : BadRequest(ModelState);
        }
        // DELETE /schedule/{scheduleID}
        [HttpDelete("byscheduleid/{scheduleID}")]
        public async Task<ActionResult<Schedule>> Delete(int scheduleID)
        {
            return ModelState.IsValid ? await _scheduleService.RemoveScheduleByIdAsync(scheduleID) : BadRequest(ModelState);
        }

        // POST schedule/ scheduleSubmission{Name, Division, startDate}
        [HttpPost]
        public async Task<ActionResult> PostAsync([FromBody] ScheduleCreation values)
        {
            return ModelState.IsValid ? await _scheduleService.CreateScheduleForDivisionAsync(values) :  BadRequest(ModelState);
        }
    }
}
