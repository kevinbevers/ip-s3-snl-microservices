using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using inhouse_microservice.Interfaces;
using inhouse_microservice.Models.External;
using inhouse_microservice.Models.Internal;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace inhouse_microservice.Controllers
{
    [Route("[controller]")]
    public class MatchStatController : Controller
    {
        private readonly IMatchStatService _matchStatService;

        public MatchStatController(IMatchStatService matchStatService)
        {
            _matchStatService = matchStatService;
        }

        [HttpGet("getmatchhistory/{pageSize}/{index}")]
        public async Task<ActionResult<IEnumerable<MatchHistory>>> GetMatchHistory(int pageSize = 10, int index = 0)
        {
            return await _matchStatService.GetInhouseMatchHistoryOverview(pageSize, index);
        }

        // POST: matchstat/savematchdata
        [HttpPost]
        [ServiceFilter(typeof(InternalServicesOnly))]
        public async Task<ActionResult> Post([FromBody] MatchData match)
        {
            return await _matchStatService.ValidateAndSaveInhouseMatchStatsAsync(match);
        }
        // GET: matchstat/matchhistorybygameid/{gameID}
        [HttpGet("matchhistorybygameid/{gameID}")]
        public async Task<ActionResult<MatchHistoryDetails>> GetMatchHistory(int gameID)
        {
            return await _matchStatService.GetInhouseMatchHistoryByGameIdAsync(gameID);
        }

        // DELETE: matchstat
        [HttpDelete("{gameID}")]
        public async Task<ActionResult<MatchHistoryDetails>> DeleteMatchStatsByGameID(int gameID)
        {
            return await _matchStatService.DeleteInhouseMatchDataByGameIdAsync(gameID);
        }

        
    }
}
