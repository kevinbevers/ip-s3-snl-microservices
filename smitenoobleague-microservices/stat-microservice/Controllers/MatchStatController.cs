using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using stat_microservice.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace stat_microservice.Controllers
{
    [Route("[controller]")]
    public class MatchStatController : Controller
    {
        private readonly IExternalServices _externalServices;

        public MatchStatController(IExternalServices externalServices)
        {
            _externalServices = externalServices;
        }

        // GET: api/values
        [HttpGet]
        public async Task<bool> Get()
        {
            return await _externalServices.SendEmailNotificationToCaptainAsync("<b>Submitted Match ID:</b> 1234567890 <br /><b>Game:</b> 1 <br /> <b>Opponent:</b> Spacestation gaming. <br /><br /> The match was played on 3 January 2021 19:35 GMT", "Match ID submitted successfully", "kevin.bevers@hotmail.com");
        }

        // GET api/values/5
        [HttpGet("{id}")]
        [ServiceFilter(typeof(InternalServicesOnly))]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
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
