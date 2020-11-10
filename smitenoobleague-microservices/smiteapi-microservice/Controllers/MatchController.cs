using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using smiteapi_microservice.External_Models;
using smiteapi_microservice.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace smiteapi_microservice.Controllers
{
    [ServiceFilter(typeof(GatewayOnly))]
    [Route("[controller]")]
    public class MatchController : Controller
    {
        private readonly IHirezApiService _hirezApiService;

        public MatchController(IHirezApiService apiService)
        {
            _hirezApiService = apiService;
        }

        // GET: /match/134314134141
        [HttpGet("{gameID}")]
        public async Task<Match> Get(int gameID)
        {
            return await _hirezApiService.GetMatchDetailsAsync(gameID);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }
    }
}
