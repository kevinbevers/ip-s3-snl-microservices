using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using inhouse_microservice.Interfaces;
using inhouse_microservice.Models.External;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace inhouse_microservice.Controllers
{
    [Route("[controller]")]
    public class LeaderboardController : Controller
    {
        private readonly ILeaderboardService _leaderboardService;

        public LeaderboardController(ILeaderboardService leaderboardService)
        {
            _leaderboardService = leaderboardService;
        }

        // GET: leaderboard/data
        [HttpGet("data")]
        public async Task<ActionResult<LeaderboardData>> Get()
        {
            return await _leaderboardService.GetInhouseLeaderboardDataAsync();
        }

        // GET: leaderboard/data
        [HttpGet("data/landing")]
        public async Task<ActionResult<LeaderboardData>> GetLanding()
        {
            return await _leaderboardService.GetInhouseLeaderboardDataLandingPageAsync();
        }
    }
}
