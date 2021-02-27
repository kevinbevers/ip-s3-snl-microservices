using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using smiteapi_microservice.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace smiteapi_microservice.Controllers
{
    [Route("[controller]")]
    public class GenerateController : Controller
    {
        private readonly IGenerateDataService _generateDataService;

        public GenerateController(IGenerateDataService generateDataService)
        {
            _generateDataService = generateDataService;
        }

        // GET: api/values
        [HttpGet("matchdataforteamswithids/{winningTeamID}/{losingTeamID}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GenerateMatchDataForTeams(int winningTeamID, int losingTeamID, [FromQuery] DateTime playedDate, [FromQuery]bool? faultyQueueID,[FromQuery]bool? hiddenPlayersChance, [FromQuery]int? numberOfFillsWinners, [FromQuery] int? numberOfFillsLosers)
        {
            return await _generateDataService.GenerateMatchDataForMatchupWithTeamIds(winningTeamID, losingTeamID, playedDate, faultyQueueID, hiddenPlayersChance, numberOfFillsWinners, numberOfFillsLosers);
        }

        // GET: api/values
        [HttpGet("matchdataforinhousewithleagueteams/{winningTeamID}/{losingTeamID}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GenerateMatchDataForInhouse(int winningTeamID, int losingTeamID, [FromQuery] DateTime playedDate, [FromQuery] bool? faultyQueueID, [FromQuery] bool? hiddenPlayersChance, [FromQuery] int? numberOfFillsWinners, [FromQuery] int? numberOfFillsLosers)
        {
            return await _generateDataService.GenerateMatchDataForInhouseUsingLeagueTeams(winningTeamID, losingTeamID, playedDate, faultyQueueID, hiddenPlayersChance, numberOfFillsWinners, numberOfFillsLosers);
        }
    }
}
