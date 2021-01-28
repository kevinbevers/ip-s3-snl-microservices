using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using stat_microservice.Models.External;

namespace stat_microservice.Interfaces
{
    public interface IPickPercentageService
    {
        Task<ActionResult<PlayerPickPercentages>> GetPickPercentagesForPlayerByPlayerId(int? playerID);
        Task<ActionResult<TeamPickPercentages>> GetPickPercentagesForTeamByTeamId(int? teamID);
    }
}
