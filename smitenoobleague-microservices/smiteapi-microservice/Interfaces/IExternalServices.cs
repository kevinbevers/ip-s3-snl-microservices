using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using smiteapi_microservice.Models.External;
using smiteapi_microservice.Models.Internal;

namespace smiteapi_microservice.Interfaces
{
    public interface IExternalServices
    {
        Task<ObjectResult> SaveMatchdataToStatService(MatchData match);
        Task<ObjectResult> SaveInhouseMatchdataToInhouseService(MatchData match);
        Task<TeamWithDetails> GetTeamWithDetailsByIdAsync(int teamID);
    }
}
