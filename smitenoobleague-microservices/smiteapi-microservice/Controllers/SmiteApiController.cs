using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using smiteapi_microservice.Interfaces;
using smiteapi_microservice.Internal_Models;
using smiteapi_microservice.External_Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace smiteapi_microservice.Controllers
{
    [ServiceFilter(typeof(GatewayOnly))]
    [ApiController]
    [Route("[controller]")]
    public class SmiteApiController : Controller
    {
        private IHirezApiService hirezApiService;

        public SmiteApiController(IHirezApiService apiService)
        {
            hirezApiService = apiService;
        }
        // GET: /getpatchinfo
        [Route("getpatchinfo")]
        [HttpGet]
        public async Task<string> GetPatchInfo()
        {
            return await hirezApiService.GetCurrentPatchInfoAsync();
        }

        // GET /getmatchdetails/1097729213
        [Route("getmatchdetails/{gameID}")]
        [HttpGet]
        public async Task<Match> GetMatchDetails(int gameID)
        {
            return await hirezApiService.GetMatchDetailsAsync(gameID);
        }

        // POST /getmatchdetails/1097729213
        [Route("savematchtostats")]
        [HttpPost]
        public async Task<IActionResult> SaveMatchToStats(Match match)
        {
            Match matchData = await hirezApiService.GetMatchDetailsAsync(match.GameID);

           

            if (matchData.PlayerStats.Count() == 10)
            {
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }

        // GET /getmatchdetails/1097729213
        [Route("searchplayerbyname/{playername}")]
        [HttpGet]
        public async Task<IEnumerable<Player>> SearchPlayerByName(string playername)
        {
            return await hirezApiService.SearchPlayersByNameAsync(playername);
        }
    }
}
