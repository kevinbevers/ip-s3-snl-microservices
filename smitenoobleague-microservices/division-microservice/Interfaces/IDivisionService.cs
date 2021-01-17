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
        Task<ActionResult<string>> GetDivisionNameByIdAsync(int divisionID);
        Task<ActionResult<IEnumerable<Division>>> GetDivisionsAsync();
        //Division teams
        Task<ActionResult<int>> UpdateDivisionTeamsAsync(IEnumerable<Team> teams, int divisionID);
        Task<ActionResult<IEnumerable<Division>>> GetDivisionsWithTeamsAsync();
    }
}
