using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using stat_microservice.Models.External;

namespace stat_microservice.Interfaces
{
    public interface ILeaderboardService
    {
        public Task<ActionResult<LeaderboardData>> GetLeaderboardDataAsync();
    }
}
