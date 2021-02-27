using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using smiteapi_microservice.Models.External;
using smiteapi_microservice.Interfaces;
using smiteapi_microservice.Smiteapi_DB;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace smiteapi_microservice.Controllers
{
    [Route("[controller]")]
    public class QueuedMatchController : Controller
    {
        private readonly IMatchService _matchService;
        private readonly IInhouseMatchService _inhouseMatchService;

        public QueuedMatchController(IMatchService matchService, IInhouseMatchService inhouseMatchService)
        {
            _matchService = matchService;
            _inhouseMatchService = inhouseMatchService;
        }

        // GET: /queuedmatch
        [HttpGet]
        [ServiceFilter(typeof(InternalServicesOnly))]
        public async Task<ActionResult<List<QueuedMatch>>> Get()
        {
            return await _matchService.GetScheduledGamesFromDbAsync();
        }

        // POST: /queuedmatch
        [HttpPost]
        [ServiceFilter(typeof(InternalServicesOnly))]
        public async Task<IActionResult> Post([FromBody] MatchSubmission submission)
        {
            return await _matchService.ProcessScheduleApiRequestAsync(submission);

        }

        // GET: /queuedmatch/inhouse
        [HttpGet("inhouse")]
        [ServiceFilter(typeof(InternalServicesOnly))]
        public async Task<ActionResult<List<QueuedMatch>>> GetInhouse()
        {
            return await _inhouseMatchService.GetScheduledInhouseGamesFromDbAsync();
        }

        // POST: /queuedmatch/inhouse
        [HttpPost("inhouse")]
        [ServiceFilter(typeof(InternalServicesOnly))]
        public async Task<IActionResult> PostInhouse([FromBody] MatchSubmission submission)
        {
            return await _inhouseMatchService.ProcessInhouseScheduleApiRequestAsync(submission);

        }
    }
}
