using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using division_microservice.Interfaces;
using division_microservice.Models.External;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace division_microservice.Controllers
{
    //[ServiceFilter(typeof(GatewayOnly))] //disabled because api's will run in private on the same host as the gateway. only the gateway will be exposed. enable this if all api's are exposed
    [Route("[controller]")]
    public class DivisionController : Controller
    {
        private readonly IDivisionService _divisionService;

        public DivisionController(IDivisionService divisionService)
        {
            _divisionService = divisionService;
        }
        // GET: /division
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Division>>> Get() //return list of all divisions
        {
            return await _divisionService.GetDivisionsAsync();
        }
        // GET: /division/withteams
        [HttpGet("withteams")]
        public async Task<ActionResult<IEnumerable<Division>>> GetWithTeams() //return list of all divisions
        {
            return await _divisionService.GetDivisionsWithTeamsAsync();
        }

        // GET /division/getnamebyid{divisionID}
        [HttpGet("getnamebyid/{divisionID}")]
        public async Task<ActionResult<string>> GetDivisionName(int divisionID) //return 1 division object
        {
            return await _divisionService.GetDivisionNameByIdAsync(divisionID);
        }

        // GET /division/{divisionID}
        [HttpGet("{divisionID}")]
        public async Task<ActionResult<Division>> Get(int divisionID) //return 1 division object
        {
            return ModelState.IsValid ? await _divisionService.GetDivisionByIdAsync(divisionID) : BadRequest(ModelState);
        }

        // POST /division
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Division>> Post([FromBody] string divisionName) //return created division object
        {
            return ModelState.IsValid ? await _divisionService.CreateDivisionAsync(divisionName) : BadRequest(ModelState);
        }

        // PUT /division
        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Division>> Put([FromBody] Division updatedDivision) //return updated division object
        {
            return ModelState.IsValid ? await _divisionService.UpdateDivisionAsync(updatedDivision) : BadRequest(ModelState);
        }

        // DELETE /division/{divisionID}
        [HttpDelete("{divisionID}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<int>> Delete(int divisionID) //return int with amount of deleted divisions by that id. should return 1 when successfull
        {
            return ModelState.IsValid ? await _divisionService.DeleteDivisionByIdAsync(divisionID) : BadRequest(ModelState);
        }
    }
}
