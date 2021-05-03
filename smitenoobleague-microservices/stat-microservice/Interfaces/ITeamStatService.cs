using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using stat_microservice.Models.External;
using stat_microservice.Models.Internal;

namespace stat_microservice.Interfaces
{
    public interface ITeamStatService
    {
        Task<ActionResult<TeamStatistics>> GetTeamStatsByTeamIdAsync(int? teamID);
        Task<ActionResult<List<RecentMatch>>> GetTeamsMatchHistoryAsync(int? teamID, int page);
    }
}
