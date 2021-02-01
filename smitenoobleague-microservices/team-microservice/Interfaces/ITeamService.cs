using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using team_microservice.Models.External;
using Microsoft.AspNetCore.Mvc;

namespace team_microservice.Interfaces
{
    public interface ITeamService
    {
        //team for division
        Task<ActionResult<IEnumerable<Team>>> GetTeamsByDivisionIdAsync(int divisionID);
        Task<ActionResult<IEnumerable<Team>>> GetTeamsThatAreNotInADivisionAsync();
        Task<ActionResult<IEnumerable<TeamWithDetails>>> GetTeamsByDivisionIdWithDetailsAsync(int divisionID);
        Task<ActionResult<IEnumerable<TeamWithDetails>>> GetTeamsThatAreNotInADivisionWithDetailsAsync();
        Task<ActionResult> DeleteTeamsByDivisionIdAsync(int divisionID);
        Task<ActionResult> SetDivisionTeams(SetDivisionTeams divisionTeams);

        //team
        Task<ActionResult<Team>> GetAllTeamsAsync();
        Task<ActionResult<IEnumerable<Team>>> GetBasicTeamInfoBatchWithListOfIdsAsync(List<int> teamIDs);
        Task<ActionResult<Team>> GetBasicTeamInfoByTeamIdAsync(int teamID);
        Task<ActionResult<TeamWithDetails>> GetTeamWithDetailsByTeamIdAsync(int teamID);
        Task<ActionResult<Team>> UpdateTeamAsCaptainSync(TeamSubmission teamSubmisssion);
        Task<ActionResult<TeamWithDetails>> GetTeamWithDetailsByCaptainAccountIdAsync(string captainID);
        //used for match stats saving
        Task<ActionResult<TeamWithDetails>> GetTeamByMatchPlayersAsync(List<int> playersInMatch);
        Task<ActionResult<string>> GetCaptainEmailAsync(int captainTeamMemberID);

        //Admin functions
        Task<ActionResult> UpdateTeamAsAdminAsync(TeamSubmissionAdmin teamSubmisssion);
        Task<ActionResult> DeleteTeamAsync(int teamID);
        Task<ActionResult<Team>> AddTeamAsync(TeamSubmissionAdmin teamSubmisssion);

        //team members
        Task<ActionResult> UpdateTeamMemberRole(UpdateRole update);
        Task<ActionResult> AddTeamMemberToTeamAsync(TeamMemberSubmission teamMemberSubmission);
        Task<ActionResult> UpdateTeamMemberToTeamAsync(TeamMemberSubmission teamMemberSubmission);
        Task<ActionResult> DeleteTeamMemberFromTeamSync(int teamMemberID); 
    }
}
