using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using team_microservice.Interfaces;
using team_microservice.Models.External;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace team_microservice.Controllers
{
    [Route("[controller]")]
    public class TeamController : Controller
    {
        private readonly ITeamService _teamService;

        public TeamController(ITeamService teamService)
        {
            _teamService = teamService;
        }

        // GET: team-service/bydivision/{divisionID}
        [HttpGet("bydivision/{divisionID}")]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeams(int divisionID)
        {
            return await _teamService.GetTeamsByDivisionIdAsync(divisionID);
        }

        // GET: team-service/bydivisionwithdetails/{divisionID}
        [HttpGet("bydivisionwithdetails/{divisionID}")]
        public async Task<ActionResult<IEnumerable<TeamWithDetails>>>  GetTeamsWithDetails(int divisionID)
        {
            return await _teamService.GetTeamsByDivisionIdWithDetailsAsync(divisionID);
        }

        // GET: team-service/bydivision/{divisionID}
        [HttpGet("{teamID}")]
        public async Task<ActionResult<TeamWithDetails>> Get(int teamID)
        {
            return await _teamService.GetTeamWithDetailsByTeamIdAsync(teamID);
        }

        // POST team-service
        [HttpPost]
        public async Task<ActionResult<Team>> Post([FromBody]TeamSubmission teamSubmission)
        {
            return ModelState.IsValid ? await _teamService.AddTeamAsync(teamSubmission) : BadRequest(ModelState);
        }

        // POST team-service/teammember
        [HttpPost("teammember")]
        public async Task<ActionResult<Team>> Post([FromBody] TeamMemberSubmission teamMemberSubmission)
        {
            return ModelState.IsValid ? await _teamService.AddTeamMemberToTeamAsync(teamMemberSubmission) : BadRequest(ModelState);
        }

        // PUT team-service
        [HttpPut]
        public async Task<ActionResult> Put([FromBody]TeamSubmission teamSubmission)
        {
            return ModelState.IsValid ? await _teamService.UpdateTeamAsync(teamSubmission) : BadRequest(ModelState);
        }

        // PUT team-service/updaterole
        [HttpPut("updaterole")]
        public async Task<ActionResult> UpdateMemberRole([FromBody]UpdateRole update)
        {
            return ModelState.IsValid ? await _teamService.UpdateTeamMemberRole(update) : BadRequest(ModelState);
        }

        // PUT team-service/updatemember
        [HttpPut("updatemember")]
        public async Task<ActionResult> UpdateMember([FromBody]TeamMemberSubmission teamMemberSubmission)
        {
            return ModelState.IsValid ? await _teamService.UpdateTeamMemberToTeamAsync(teamMemberSubmission) : BadRequest(ModelState);
        }


        // DELETE team-service/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            return await _teamService.DeleteTeamAsync(id);
        }

        // DELETE team-service/teammember/{teamMemberID}
        [HttpDelete("teammember/{teamMemberID}")]
        public async Task<ActionResult> DeleteTeamMember(int teamMemberID)
        {
            return await _teamService.DeleteTeamMemberFromTeamSync(teamMemberID);
        }

        // DELETE team-service/bydivision/{divisionID}
        [HttpDelete("bydivision/{divisionID}")]
        public async Task<ActionResult> DeleteTeamsByDivisionID(int divisionID)
        {
            return await _teamService.DeleteTeamsByDivisionIdAsync(divisionID);
        }
    }
}
