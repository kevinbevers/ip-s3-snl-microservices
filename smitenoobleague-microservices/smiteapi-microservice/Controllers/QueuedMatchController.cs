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

        public QueuedMatchController(IMatchService matchService)
        {
            _matchService = matchService;
        }

        // GET: /queuedmatch
        [HttpGet]
        public async Task<ActionResult<List<QueuedMatch>>> Get()
        {
            return await _matchService.GetScheduledGamesFromDB();
        }

        // POST: /queuedmatch
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] MatchSubmission submission)
        {
            return await _matchService.ProcessMatchID(submission);

        }
    }
}
