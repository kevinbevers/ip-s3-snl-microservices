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
    public class TeamStatService : ITeamStatService
    {
        private readonly SNL_Stat_DBContext _db;
        private readonly ILogger<PlayerStatService> _logger;
        private readonly IExternalServices _externalServices;

        public TeamStatService(SNL_Stat_DBContext db, ILogger<PlayerStatService> logger, IExternalServices externalServices)
        {
            _db = db;
            _logger = logger;
            _externalServices = externalServices;
        }

        public async Task<ActionResult<TeamStatistics>> GetTeamStatsByTeamIdAsync(int? teamID)
        {
            try
            {
                TeamWithDetails foundTeam = await _externalServices.GetTeamWithDetailsByTeamId(teamID);
                if (foundTeam != null)
                {
                    //List<TableStat> foundStats = await _db.TableStats.Where(ts => ts.PlayerId == playerID).ToListAsync();
                    //Get stats, probably best to calculate stats with sql as much as possible to make it faster
                    string divisionName = await _externalServices.GetDivisionNameByDivisionID(foundTeam?.DivisionID);

                    TeamStatistics teamStats = new TeamStatistics
                    {
                        Team = foundTeam,
                        DivisionName = divisionName

                    };

                    return new ObjectResult(teamStats) { StatusCode = 200 }; //OK
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
