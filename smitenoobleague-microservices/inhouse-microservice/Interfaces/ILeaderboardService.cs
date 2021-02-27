using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using inhouse_microservice.Models.External;

namespace inhouse_microservice.Interfaces
{
    public interface ILeaderboardService
    {
        public Task<ActionResult<LeaderboardData>> GetInhouseLeaderboardDataAsync();
        public Task<ActionResult<LeaderboardData>> GetInhouseLeaderboardDataLandingPageAsync();
    }
}
