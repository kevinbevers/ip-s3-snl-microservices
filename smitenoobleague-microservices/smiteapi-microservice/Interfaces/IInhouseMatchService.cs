using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using smiteapi_microservice.Models.External;

namespace smiteapi_microservice.Interfaces
{
    public interface IInhouseMatchService
    {
        //Inhouse Schedule Api logic
        Task<ActionResult> ProcessInhouseMatchIdAsync(int? gameID);
        Task<ActionResult> ProcessInhouseScheduleApiRequestAsync(MatchSubmission submission);
        Task<ActionResult<List<QueuedMatch>>> GetScheduledInhouseGamesFromDbAsync();
    }
}
