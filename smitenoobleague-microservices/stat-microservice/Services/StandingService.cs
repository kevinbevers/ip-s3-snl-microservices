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
    public class StandingService : IStandingService
    {
        private readonly SNL_Stat_DBContext _db;
        private readonly ILogger<StandingService> _logger;
        private readonly IExternalServices _externalServices;

        public StandingService(SNL_Stat_DBContext db, ILogger<StandingService> logger, IExternalServices externalServices)
        {
            _db = db;
            _logger = logger;
            _externalServices = externalServices;
        }

        public async Task<ActionResult<ScheduleStandingList>> GetStandingsByScheduleId(int? scheduleID)
        {
            try
            {
                List<TableStanding> foundStandings = await _db.TableStandings.Where(ts => ts.ScheduleId == scheduleID).ToListAsync();
                if (foundStandings?.Count() > 0)
                {
                    List<int?> teamsInfoundStandings = foundStandings.Select(x => x.TeamId).Distinct().ToList();
                    IEnumerable<Team> teams = await _externalServices.GetBasicTeamInfoInBatchWithTeamIdsList(teamsInfoundStandings.Where(x => x != null).Select(x => x.Value).ToList());

                    ScheduleStandingList returnStandings = new ScheduleStandingList { scheduleID = scheduleID, Standings = new List<Standing>() };

                    foreach(var standing in foundStandings)
                    {
                        var last5MatchupIds = await _db.TableMatchResults.Where(tmr => tmr.AwayTeamId == standing.TeamId || tmr.HomeTeamId == standing.TeamId).Select(t => new { t.DatePlayed, t.ScheduleMatchUpId }).Distinct().OrderByDescending(t => t.DatePlayed).Take(5).Select(x => x.ScheduleMatchUpId).ToListAsync();
                        var lastResults = await _db.TableMatchResults.Where(t => last5MatchupIds.Contains(t.ScheduleMatchUpId)).GroupBy(x => x.ScheduleMatchUpId, (x, y) => new {MatchupID = x ,GamesWon = y.Count(i => i.WinningTeamId == standing.TeamId), GamesLost = y.Count(i => i.LosingTeamId == standing.TeamId), DatePlayed = y.Select(i => i.DatePlayed).Max().Value }).ToListAsync();
                        List<WinLoss> WinLoss = new List<WinLoss>();
                        foreach(var result in lastResults.OrderByDescending(t => t.DatePlayed)) // latest first 
                        {
                            WinLoss wl = new WinLoss {MatchupID = result.MatchupID, DatePlayed = result.DatePlayed, Won = null };

                            if (result.GamesLost + result.GamesWon >= 2) // if the matchup is finished
                            {
                                if (result.GamesWon > 1) // 2 gamesWon needed to win a best of 3
                                {
                                    wl.Won = true;
                                }
                                else // else lost
                                {
                                    wl.Won = false;
                                }
                            }

                            WinLoss.Add(wl);
                        }
                        //add extra entries so it always returns a list of 5
                        if(WinLoss.Count() < 5)
                        {
                            for(int i = WinLoss.Count(); i < 5; i++)
                            {
                                WinLoss.Add(new WinLoss { Won = null, MatchupID = null, DatePlayed = null });
                            }
                        }

                        returnStandings.Standings.Add(new Standing
                        {
                            Team = teams.Where(x => x.TeamID == standing.TeamId).FirstOrDefault(),
                            StandingScore = standing.StandingScore,
                            StandingWins = standing.StandingWins,
                            StandingLosses = standing.StandingLosses,
                            Last5Results = WinLoss
                        });
                    }

                    //order the standings on score
                    returnStandings.Standings = returnStandings.Standings.OrderByDescending(x => x.StandingScore).ToList();

                    return new ObjectResult(returnStandings) { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No standings found with the scheduleID.") { StatusCode = 404 }; //OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get standings with scheduleID.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get standings with scheduleID.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }
    }
}
