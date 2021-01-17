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
    public class PlayerStatcontroller : Controller
    {
        private readonly IPlayerStatService _playerStatService;

        public PlayerStatcontroller(IPlayerStatService playerStatService)
        {
            _playerStatService = playerStatService;
        }
        // GET: stat-service/playerstat/byid
        [HttpGet("byplayerid/{playerID}")]
        public async Task<ActionResult<PlayerStatistics>> Get(int? playerID)
        {
            return await _playerStatService.GetPlayerStatsByPlayerID(playerID);
        }
    }
}
