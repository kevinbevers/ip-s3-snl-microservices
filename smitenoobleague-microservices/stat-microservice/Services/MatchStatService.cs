using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using stat_microservice.Interfaces;
using stat_microservice.Models.Internal;
using stat_microservice.Stat_DB;

namespace stat_microservice.Services
{
    public class MatchStatService : IMatchStatService
    {
        private readonly SNL_Stat_DBContext _db;
        private readonly ILogger<MatchStatService> _logger;
        private readonly IExternalServices _externalServices;

        public MatchStatService(SNL_Stat_DBContext db, ILogger<MatchStatService> logger, IExternalServices externalServices)
        {
            _db = db;
            _logger = logger;
            _externalServices = externalServices;

        }

        public async Task<ActionResult> GetMatchStatByGameID(int gameID)
        {
            try
            {
                return new ObjectResult("Matchstats") { StatusCode = 200 };
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to Get Match stats by gameID.");
                //return result to client
                return new ObjectResult("Something went wrong trying to Get Match stats by gameID.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> SaveMatchStats(MatchData match)
        {
            try
            {
                List<int> IdsOfPlayerInMatchWinners = new List<int>();
                List<int> IdsOfPlayerInMatchLosers = new List<int>();
                //Add All player ids to 1 array of ints
                match.Winners.ForEach(p => IdsOfPlayerInMatchWinners.Add((int)p.player.PlayerID));
                match.Winners.ForEach(p => IdsOfPlayerInMatchLosers.Add((int)p.player.PlayerID));
                //Call team service to get the teams that where in this match.
                TeamWithDetails winnerTeam = await _externalServices.GetTeamByPlayersAsync(IdsOfPlayerInMatchWinners);
                TeamWithDetails loserTeam = await _externalServices.GetTeamByPlayersAsync(IdsOfPlayerInMatchLosers);

                if (winnerTeam == null || loserTeam == null)
                {
                    //one of the teams in the match was not found. this means the submitted match is invalid.

                }

                return new ObjectResult("Match stats successfully saved") { StatusCode = 200 };
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to Save Match stats.");
                //return result to client
                return new ObjectResult("Something went wrong trying to Save Match stats.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }
    }
}
