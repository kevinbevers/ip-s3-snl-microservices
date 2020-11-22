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
    public class PlayerController : Controller
    {
        private readonly IHirezApiService _hirezApiService;

        public PlayerController(IHirezApiService apiService)
        {
            _hirezApiService = apiService;
        }

        // GET: /player/lolliepoep
        [HttpGet("{playername}")]
        public async Task<IEnumerable<Player>> Get(string playername)
        {
            return await _hirezApiService.SearchPlayersByNameAsync(playername);
        }
    }
}
