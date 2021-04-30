using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using stat_microservice.Models.External;
using stat_microservice.Models.Internal;

namespace stat_microservice.Interfaces
{
    public interface IMatchStatService
    {
        Task<ActionResult> ValidateAndSaveMatchStatsAsync(MatchData match);
        Task<ActionResult> ValidateAndSaveMatchStatsWithPrivacyFlaggedFillAsync(MatchData match);
        Task<ActionResult<IEnumerable<MatchHistory>>> GetMatchHistoryOverview(int pageSize, int pageIndex);
        Task<ActionResult<MatchHistoryDetails>> GetMatchHistoryByMatchupIdAsync(int matchupID);
        Task<ActionResult> ForfeitGameInMatchupAsync(int matchupID, int forfeitingTeamID);
    }
}
