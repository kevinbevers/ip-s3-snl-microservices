using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using stat_microservice.Models.Internal;

namespace stat_microservice.Interfaces
{
    public interface IMatchStatService
    {
        Task<ActionResult> SaveMatchStats(MatchData match);
        Task<ActionResult> GetMatchStatByGameID(int gameID);
    }
}
