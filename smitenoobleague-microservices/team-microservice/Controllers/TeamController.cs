using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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
        public async Task<ActionResult<IEnumerable<TeamWithDetails>>> GetTeamsWithDetails(int divisionID)
        {
            return await _teamService.GetTeamsByDivisionIdWithDetailsAsync(divisionID);
        }


        // GET: team-service/division-less
        [HttpGet("divisionless")]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeamsWithoutDivision()
        {
            return await _teamService.GetTeamsThatAreNotInADivisionAsync();
        }

        // GET: team-service/division-lesswithdetails
        [HttpGet("divisionlesswithdetails")]
        public async Task<ActionResult<IEnumerable<TeamWithDetails>>> GetTeamWithDetailsWithoutDivision()
        {
            return await _teamService.GetTeamsThatAreNotInADivisionWithDetailsAsync();
        }

        // GET: team-service/{divisionID}
        [HttpGet]
        public async Task<ActionResult<Team>> Get()
        {
            return await _teamService.GetAllTeamsAsync();
        }

        // GET: team-service/{divisionID}
        [HttpGet("{teamID}")]
        public async Task<ActionResult<TeamWithDetails>> Get(int teamID)
        {
            return await _teamService.GetTeamWithDetailsByTeamIdAsync(teamID);
        }

        // GET: team-service/{divisionID}
        [HttpGet("bycaptainid/{captainID}")]
        [Authorize(Roles = "Captain,Admin")]
        public async Task<ActionResult<TeamWithDetails>> GetByCaptainID(string captainID)
        {
            return await _teamService.GetTeamWithDetailsByCaptainAccountIdAsync(captainID);
        }

        // POST team-service/captainmail
        [HttpGet("captainmailbyid/{captainTeamMemberID}")]
        [ServiceFilter(typeof(InternalServicesOnly))]
        public async Task<ActionResult<string>> GetCaptainEmailWithCaptainTeamMemberID(int captainTeamMemberID)
        {
            return await _teamService.GetCaptainEmailAsync(captainTeamMemberID);
        }

        // POST team-service
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Team>> Post([FromBody]TeamSubmissionAdmin teamSubmission)
        {
            return ModelState.IsValid ? await _teamService.AddTeamAsync(teamSubmission) : BadRequest(ModelState);
        }
        // POST team-service/setdivisionforteams
        [HttpPost("setdivisionforteams")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Team>> PostTeamDivisions([FromBody] SetDivisionTeams divisionTeams)
        {
            return ModelState.IsValid ? await _teamService.SetDivisionTeams(divisionTeams) : BadRequest(ModelState);
        }

        // POST team-service/teammember
        [HttpPost("teammember")]
        [Authorize(Roles = "Captain,Admin")]
        public async Task<ActionResult<Team>> Post([FromBody] TeamMemberSubmission teamMemberSubmission)
        {
            return ModelState.IsValid ? await _teamService.AddTeamMemberToTeamAsync(teamMemberSubmission) : BadRequest(ModelState);
        }

        // POST team-service/findteam
        [HttpPost("findteam")]
        [ServiceFilter(typeof(InternalServicesOnly))]
        public async Task<ActionResult<TeamWithDetails>> PostListOfPlayersToFindTeam([FromBody] List<int> playersInMatch)
        {
            return ModelState.IsValid ? await _teamService.GetTeamByMatchPlayersAsync(playersInMatch) : BadRequest(ModelState);
        }

        // PUT team-service
        [HttpPut]
        [Authorize(Roles = "Captain,Admin")]
        public async Task<ActionResult> Put([FromBody] TeamSubmission teamSubmission)
        {
            return ModelState.IsValid ? await _teamService.UpdateTeamAsCaptainSync(teamSubmission) : BadRequest(ModelState);
        }

        // PUT team-service
        [HttpPut("admin")]
        [Authorize(Roles = "Captain,Admin")]
        public async Task<ActionResult> PutAdmin([FromBody]TeamSubmissionAdmin teamSubmission)
        {
            return ModelState.IsValid ? await _teamService.UpdateTeamAsAdminAsync(teamSubmission) : BadRequest(ModelState);
        }

        // PUT team-service/updaterole
        [HttpPut("updaterole")]
        [Authorize(Roles = "Captain,Admin")]
        public async Task<ActionResult> UpdateMemberRole([FromBody]UpdateRole update)
        {
            return ModelState.IsValid ? await _teamService.UpdateTeamMemberRole(update) : BadRequest(ModelState);
        }

        // PUT team-service/updatemember
        [HttpPut("updatemember")]
        [Authorize(Roles = "Captain,Admin")]
        public async Task<ActionResult> UpdateMember([FromBody]TeamMemberSubmission teamMemberSubmission)
        {
            return ModelState.IsValid ? await _teamService.UpdateTeamMemberToTeamAsync(teamMemberSubmission) : BadRequest(ModelState);
        }


        // DELETE team-service/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(int id)
        {
            return await _teamService.DeleteTeamAsync(id);
        }

        // DELETE team-service/teammember/{teamMemberID}
        [HttpDelete("teammember/{teamMemberID}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteTeamMember(int teamMemberID)
        {
            return await _teamService.DeleteTeamMemberFromTeamSync(teamMemberID);
        }

        // DELETE team-service/bydivision/{divisionID}
        [HttpDelete("bydivision/{divisionID}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteTeamsByDivisionID(int divisionID)
        {
            return await _teamService.DeleteTeamsByDivisionIdAsync(divisionID);
        }
    }
}
