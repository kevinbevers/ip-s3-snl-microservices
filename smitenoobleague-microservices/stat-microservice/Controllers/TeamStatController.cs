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
    public class TeamStatController : Controller
    {
        private readonly ITeamStatService _teamStatService;

        public TeamStatController(ITeamStatService teamStatService)
        {
            _teamStatService = teamStatService;
        }
        // GET: stat-service/playerstat/byid
        [HttpGet("byteamid/{teamID}")]
        public async Task<ActionResult<TeamStatistics>> Get(int? teamID)
        {
            return await _teamStatService.GetTeamStatsByTeamIdAsync(teamID);
        }
    }
}
