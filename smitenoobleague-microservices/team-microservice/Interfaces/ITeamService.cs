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
        Task<ActionResult<IEnumerable<TeamWithDetails>>> GetTeamsByDivisionIdWithDetailsAsync(int divisionID);
        Task<ActionResult> DeleteTeamsByDivisionIdAsync(int divisionID);

        //team    
        Task<ActionResult<TeamWithDetails>> GetTeamWithDetailsByTeamIdAsync(int teamID);
        Task<ActionResult<Team>> AddTeamAsync(TeamSubmission teamSubmisssion);
        Task<ActionResult> UpdateTeamAsync(TeamSubmission teamSubmisssion);
        Task<ActionResult> DeleteTeamAsync(int teamID);

        //team members
        Task<ActionResult> UpdateTeamMemberRole(UpdateRole update);
        Task<ActionResult> AddTeamMemberToTeamAsync(TeamMemberSubmission teamMemberSubmission);
        Task<ActionResult> UpdateTeamMemberToTeamAsync(TeamMemberSubmission teamMemberSubmission);
        Task<ActionResult> DeleteTeamMemberFromTeamSync(int teamMemberID);
    }
}
