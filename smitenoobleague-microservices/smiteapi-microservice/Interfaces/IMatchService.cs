using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using smiteapi_microservice.Models.External;

namespace smiteapi_microservice.Interfaces
{
    public interface IMatchService
    {
        //User call logic
        Task<ActionResult> ProcessMatchIdAsync(int gameID);
        Task<ActionResult<MatchData>> GetRawMatchDataAsync(int gameID);
        //Schedule Api logic
        Task<ActionResult> ProcessScheduleApiRequestAsync(MatchSubmission submission);
        Task<ActionResult<List<QueuedMatch>>> GetScheduledGamesFromDbAsync();
    }
}
