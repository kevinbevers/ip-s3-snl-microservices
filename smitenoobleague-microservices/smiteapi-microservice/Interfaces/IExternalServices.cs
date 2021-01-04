using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using smiteapi_microservice.Models.External;

namespace smiteapi_microservice.Interfaces
{
    public interface IExternalServices
    {
        Task<ObjectResult> SaveMatchdataToStatService(MatchData match);
    }
}
