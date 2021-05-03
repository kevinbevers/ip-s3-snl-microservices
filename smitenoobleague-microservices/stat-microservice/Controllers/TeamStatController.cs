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
    public class TeamStatController : Controller
    {
        private readonly ITeamStatService _teamStatService;
        private readonly IPickPercentageService _pickPercentageService;

        public TeamStatController(ITeamStatService teamStatService, IPickPercentageService pickPercentageService)
        {
            _teamStatService = teamStatService;
            _pickPercentageService = pickPercentageService;
        }
        // GET: stat-service/teamstat/byid
        [HttpGet("byteamid/{teamID}")]
        public async Task<ActionResult<TeamStatistics>> Get(int? teamID)
        {
            return await _teamStatService.GetTeamStatsByTeamIdAsync(teamID);
        }

        // GET: stat-service/teamstat/getrecentmatchpage/{teamID}/{page}
        [HttpGet("getrecentmatchpage/{teamID}/{page}")]
        public async Task<ActionResult<List<RecentMatch>>> GetRecentMatches(int? teamID, int page)
        {
            return await _teamStatService.GetTeamsMatchHistoryAsync(teamID, page);
        }

        // GET: stat-service/teamstat/pickpercentagesbyteamid
        [HttpGet("pickpercentagesbyteamid/{teamID}")]
        public async Task<ActionResult<TeamPickPercentages>> GetPlayerPickPercentages(int? teamID)
        {
            return await _pickPercentageService.GetPickPercentagesForTeamByTeamId(teamID);
        }
    }
}
