using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using stat_microservice.Interfaces;
using stat_microservice.Models.Internal;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace stat_microservice.Controllers
{
    [Route("[controller]")]
    public class MatchStatController : Controller
    {
        private readonly IExternalServices _externalServices;
        private readonly IMatchStatService _matchStatService;

        public MatchStatController(IExternalServices externalServices, IMatchStatService matchStatService)
        {
            _externalServices = externalServices;
            _matchStatService = matchStatService;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        [ServiceFilter(typeof(InternalServicesOnly))]
        public async Task<ActionResult> Get(int id)
        {
            return await _matchStatService.GetMatchStatByGameIDAsync(id);
        }

        // POST matchstat/savematchdata
        [HttpPost]
        [ServiceFilter(typeof(InternalServicesOnly))]
        public async Task<ActionResult> Post([FromBody] MatchData match)
        {
            return await _matchStatService.ValidateAndSaveMatchStatsAsync(match);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
