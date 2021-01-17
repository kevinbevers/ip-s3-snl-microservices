using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using stat_microservice.Interfaces;
using stat_microservice.Models.External;
using stat_microservice.Stat_DB;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using stat_microservice.Models.Internal;

namespace stat_microservice.Services
{
    public class PlayerStatService : IPlayerStatService
    {
        private readonly SNL_Stat_DBContext _db;
        private readonly ILogger<PlayerStatService> _logger;
        private readonly IExternalServices _externalServices;

        public PlayerStatService(SNL_Stat_DBContext db, ILogger<PlayerStatService> logger, IExternalServices externalServices)
        {
            _db = db;
            _logger = logger;
            _externalServices = externalServices;
        }

        public async Task<ActionResult<PlayerStatistics>> GetPlayerStatsByPlayerIdAsync(int? playerID)
        {
            try
            {
                PlayerWithTeamInfo foundPlayer = await _externalServices.GetPlayerWithTeamInfoByPlayerIdAsync(playerID);
                if(foundPlayer != null)
                {
                    //List<TableStat> foundStats = await _db.TableStats.Where(ts => ts.PlayerId == playerID).ToListAsync();
                    //Get stats, probably best to calculate stats with sql as much as possible to make it faster

                    PlayerStatistics playerStats = new PlayerStatistics
                    {
                        Player = foundPlayer?.Player,
                        Team = foundPlayer?.Team,

                    };

                    return new ObjectResult(playerStats) { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No player found with the given ID.") { StatusCode = 404 }; //OK
                }  
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get player stats with player ID.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get player stats with player ID.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }
    }
}
