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
    public class PlayerStatController : Controller
    {
        private readonly IPlayerStatService _playerStatService;
        private readonly IPickPercentageService _pickPercentageService;

        public PlayerStatController(IPlayerStatService playerStatService, IPickPercentageService pickPercentageService)
        {
            _playerStatService = playerStatService;
            _pickPercentageService = pickPercentageService;
        }
        // GET: stat-service/playerstat/byplayerid
        [HttpGet("byplayerid/{playerID}")]
        public async Task<ActionResult<PlayerStatistics>> Get(int? playerID)
        {
            return await _playerStatService.GetPlayerStatsByPlayerIdAsync(playerID);
        }

        // GET: stat-service/playerstat/pickpercentagesbyplayerid
        [HttpGet("pickpercentagesbyplayerid/{playerID}")]
        public async Task<ActionResult<PlayerPickPercentages>> GetPlayerPickPercentages(int? playerID)
        {
            return await _pickPercentageService.GetPickPercentagesForPlayerByPlayerId(playerID);
        }
    }
}
