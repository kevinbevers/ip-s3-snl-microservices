using System;
using Microsoft.AspNetCore.Mvc;
using division_microservice.Models.External;
using System.Threading.Tasks;
using division_microservice.Models.Internal;
using System.Collections.Generic;

namespace division_microservice.Interfaces
{
    public interface IDivisionService
    {
        //Division
        Task<ActionResult<Division>> CreateDivisionAsync(string divisionName);
        Task<ActionResult<Division>> UpdateDivisionAsync(Division division);
        Task<ActionResult<int>> DeleteDivisionByIdAsync(int divisionID);
        Task<ActionResult<Division>> GetDivisionByIdAsync(int divisionID);
        //Division teams
        Task<ActionResult<int>> AddTeamsToDivisionAsync(IEnumerable<Team> teamsToAdd, int divisionID);
        Task<ActionResult<int>> RemoveTeamsFromDivisionAsync(IEnumerable<Team> teamsToRemove, int divisionID);
    }
}
