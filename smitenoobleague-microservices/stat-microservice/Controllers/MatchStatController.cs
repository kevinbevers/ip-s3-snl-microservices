using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using stat_microservice.Interfaces;
using stat_microservice.Models.External;
using stat_microservice.Models.Internal;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace stat_microservice.Controllers
{
    [Route("[controller]")]
    public class MatchStatController : Controller
    {
        private readonly IMatchStatService _matchStatService;

        public MatchStatController(IMatchStatService matchStatService)
        {
            _matchStatService = matchStatService;
        }

        // GET: api/values/5
        [HttpGet("getmatchstatsbygameid/{id}")]
        public async Task<ActionResult> Get(int id)
        {
            return await _matchStatService.GetMatchStatByGameIdAsync(id);
        }

        [HttpGet("getmatchhistory/{pageSize}/{index}")]
        public async Task<ActionResult<IEnumerable<MatchHistory>>> GetMatchHistory(int pageSize = 10, int index = 0)
        {
            return await _matchStatService.GetMatchHistoryOverview(pageSize, index);
        }

        // POST: matchstat/savematchdata
        [HttpPost]
        [ServiceFilter(typeof(InternalServicesOnly))]
        public async Task<ActionResult> Post([FromBody] MatchData match)
        {
            return await _matchStatService.ValidateAndSaveMatchStatsAsync(match);
        }

        //Something needs to fixed, swagger can't load this for some reason
        // GET: matchstat/matchhistorybymatchupid/{matchupID}
        [HttpGet("matchhistorybymatchupid/{matchupID}")]
        public async Task<ActionResult<MatchHistoryDetails>> GetMatchHistory(int matchupID)
        {
            return await _matchStatService.GetMatchHistoryByMatchupIdAsync(matchupID);
        }
    }
}
