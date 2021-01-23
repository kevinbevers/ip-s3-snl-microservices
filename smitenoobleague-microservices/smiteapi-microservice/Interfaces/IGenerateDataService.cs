using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace smiteapi_microservice.Interfaces
{
    public interface IGenerateDataService
    {
        Task<ActionResult> GenerateMatchDataForMatchupWithTeamIds(int winningTeamId, int losingTeamId, DateTime? playedDate, bool? faultyQueueID, bool? hiddenPlayersChance, int? numberOfFillsWinners, int? numberOfFillsLosers);
    }
}
