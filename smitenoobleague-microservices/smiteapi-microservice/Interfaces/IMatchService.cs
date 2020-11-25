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
        Task<IActionResult> ProcessMatchID(MatchSubmission submission);
        Task<ActionResult<MatchData>> GetRawMatchData(int gameID);
        //Schedule Api logic
        Task<IActionResult> ProcessScheduleApiRequest(MatchSubmission submission);
        Task<ActionResult<List<QueuedMatch>>> GetScheduledGamesFromDB();
    }
}
