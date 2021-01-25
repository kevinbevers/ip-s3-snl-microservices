using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using stat_microservice.Interfaces;
using stat_microservice.Models.External;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace stat_microservice.Controllers
{
    [Route("[controller]")]
    public class StandingController : Controller
    {
        private readonly IStandingService _standingService;

        public StandingController(IStandingService standingService)
        {
            _standingService = standingService;
        }
        // GET: standingbyscheduleid/{scheduleID}
        [HttpGet("standingbyscheduleid/{scheduleID}")]
        public async Task<ActionResult<ScheduleStandingList>> Get(int? scheduleID)
        {
            return await _standingService.GetStandingsByScheduleId(scheduleID);
        }
    }
}
