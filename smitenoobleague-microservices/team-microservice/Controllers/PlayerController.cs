using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using team_microservice.Interfaces;
using team_microservice.Models.External;
using team_microservice.Models.Internal;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace team_microservice.Controllers
{
    [Route("[controller]")]
    public class PlayerController : Controller
    {
        private readonly IPlayerService _playerService;

        public PlayerController(IPlayerService playerService)
        {
            _playerService = playerService;
        }

        // GET team-service/player/bydivision/{id}
        [HttpGet("bydivision/{divisionID}")]
        public async Task<ActionResult<IEnumerable<PlayerWithTeamInfo>>> GetPlayersList(int? divisionID)
        {
            return await _playerService.GetPlayersByDivisionIdAsync(divisionID);
        }
        // GET team-service/player/bydivision/{id}
        [HttpGet("byplayerid/{playerID}")]
        public async Task<ActionResult<PlayerWithTeamInfo>> GetPlayer(int? playerID)
        {
            return await _playerService.GetPlayerWithTeamInfoByPlayerID(playerID);
        }

        // GET team-service/player/getallroles
        [HttpGet("getallroles")]
        [ServiceFilter(typeof(InternalServicesOnly))]
        public async Task<ActionResult<List<Role>>> GetRoleData()
        {
            return await _playerService.GetAllRolesAsync();
        }
    }
}
