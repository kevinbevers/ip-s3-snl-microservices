using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using inhouse_microservice.Models.External;
using inhouse_microservice.Models.Internal;

namespace inhouse_microservice.Interfaces
{
    public interface IMatchStatService
    {
        Task<ActionResult> ValidateAndSaveInhouseMatchStatsAsync(MatchData match);
        Task<ActionResult<IEnumerable<MatchHistory>>> GetInhouseMatchHistoryOverview(int pageSize, int pageIndex);
        Task<ActionResult<MatchHistoryDetails>> GetInhouseMatchHistoryByGameIdAsync(int gameId);
        Task<ActionResult> DeleteInhouseMatchDataByGameIdAsync(int gameId);
    }
}
