﻿using System;
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
    public class LeaderboardController : Controller
    {
        private readonly ILeaderboardService _leaderboardService;

        public LeaderboardController(ILeaderboardService leaderboardService)
        {
            _leaderboardService = leaderboardService;
        }
        // GET: stat-service/leaderboard/data/{divisionID}
        [HttpGet("data/{divisionID}")]
        public async Task<ActionResult<LeaderboardData>> Get(int? divisionID)
        {
            return await _leaderboardService.GetLeaderboardDataAsync(divisionID);
        }
    }
}
