using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using stat_microservice.Models.External;

namespace stat_microservice.Interfaces
{
    public interface ITeamStatService
    {
        Task<ActionResult<TeamStatistics>> GetTeamStatsByTeamIdAsync(int? teamID);
    }
}
