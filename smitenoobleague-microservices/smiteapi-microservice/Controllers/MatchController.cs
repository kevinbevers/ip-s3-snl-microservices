using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using smiteapi_microservice.Models.External;
using smiteapi_microservice.Interfaces;
//database
using smiteapi_microservice.Smiteapi_DB;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace smiteapi_microservice.Controllers
{
    //[ServiceFilter(typeof(GatewayOnly))]
    [Route("[controller]")]
    public class MatchController : Controller
    {
        private readonly IMatchService _matchService;

        public MatchController(IMatchService matchService)
        {
            _matchService = matchService;
        }

        // GET: /match/134314134141
        [HttpGet("{gameID}")]
        public async Task<ActionResult<MatchData>> Get(int gameID)
        {
            return await _matchService.GetRawMatchDataAsync(gameID);
        }

        // POST /match
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]MatchSubmission submission)
        {
            return await _matchService.ProcessMatchIdAsync(submission);
        }
    }
}
