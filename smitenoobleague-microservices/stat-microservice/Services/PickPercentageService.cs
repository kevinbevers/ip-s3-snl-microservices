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
    public class PickPercentageService : IPickPercentageService
    {
        private readonly SNL_Stat_DBContext _db;
        private readonly ILogger<PickPercentageService> _logger;
        private readonly IExternalServices _externalServices;

        public PickPercentageService(SNL_Stat_DBContext db, ILogger<PickPercentageService> logger, IExternalServices externalServices)
        {
            _db = db;
            _logger = logger;
            _externalServices = externalServices;
        }

        public async Task<ActionResult<PlayerPickPercentages>> GetPickPercentagesForPlayerByPlayerId(int? playerID)
        {
            try
            {
                PlayerWithTeamInfo foundPlayer = await _externalServices.GetPlayerWithTeamInfoByPlayerIdAsync(playerID);
                if (foundPlayer != null || await _db.TableStats.Where(x => x.PlayerId == playerID).CountAsync() > 0)
                {
                    var playerData = await _db.TableStats.Where(x => x.PlayerId == playerID).Select(x => new { name = x.PlayerName, platform = ((ApiPlatformEnum)x.PlayerPlatformId).ToString() }).FirstOrDefaultAsync();
                    PlayerPickPercentages playerPickPercentages = new PlayerPickPercentages {
                        Player = foundPlayer?.Player != null ? foundPlayer.Player : new TeamMember { TeamMemberName = playerData.name, TeamMemberPlatform = playerData.platform, PlayerID = (int)playerID },
                    Team = foundPlayer?.Team,
                        TotalGamesPlayed = _db.TableStats.Where(x => x.PlayerId == playerID).Select(x => new { x.GameId, x.MatchupId }).Distinct().Count(),
                        TotalGamesPlayedInSNL = _db.TableStats.Select(x => new { x.GameId, x.MatchupId }).Distinct().Count(),
                        Gods = await GetGodWithPickPercentagesForPlayerAsync(playerID)
                    };

                    return new ObjectResult(playerPickPercentages) { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No player found with the given ID.") { StatusCode = 404 }; //OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get player pick % with player ID.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get player pick % with player ID.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<TeamPickPercentages>> GetPickPercentagesForTeamByTeamId(int? teamID)
        {
            try
            {
                Team foundTeam = await _externalServices.GetBasicTeamInfoByTeamId(teamID);
                if (foundTeam != null)
                {
                    TeamPickPercentages teamPickPercentages = new TeamPickPercentages
                    {
                        Team = foundTeam,
                        TotalGamesPlayed = _db.TableStats.Where(x => x.TeamId == teamID).Select(x => new { x.GameId, x.MatchupId }).Distinct().Count(),
                        TotalGamesPlayedInSNL = _db.TableStats.Select(x => new { x.GameId, x.MatchupId }).Distinct().Count(),
                        Gods = await GetGodWithPickPercentagesForTeamAsync(teamID)
                };
                   
                    return new ObjectResult(teamPickPercentages) { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No team found with the given ID.") { StatusCode = 404 }; //OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get team pick % with team ID.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get team pick % with team ID.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        #region methods
        private async Task<List<GodWithPickPercentage>> GetGodWithPickPercentagesForPlayerAsync(int? playerID)
        {
            //Get god data and times played for player and SNL total
            List<GodWithPickPercentage> godWithPickPercentages = await _db.TableStats.Join(_db.TableGodDetails, stat => stat.GodPlayedId, god => god.GodId, (stat, god) => new
            {
                GodName = god.GodName,
                GodId = god.GodId,
                GodIconUrl = god.GodIconUrl,
                Stats = stat,
            }).GroupBy(y => y.GodId, (y, z) => new GodWithPickPercentage
            {
                GodId = y,
                GodName = z.Select(g => g.GodName).Min(),
                GodIcon = z.Select(g => g.GodIconUrl).Min(),
                TimesPlayedInSNL = z.Where(s => s.Stats.GodPlayedId == y).Count(),
                TimesPlayed = z.Where(s => s.Stats.GodPlayedId == y && s.Stats.PlayerId == playerID).Count(),
            }).OrderBy(x => x.GodName).ToListAsync();


            //Get all ban counts
            var ListOfBans = await _db.TableStats.Select(x => new { x.IgBan1Id, x.IgBan2Id, x.IgBan3Id, x.IgBan4Id, x.IgBan5Id, x.IgBan6Id, x.IgBan7Id, x.IgBan8Id, x.IgBan9Id, x.IgBan10Id, x.MatchupId, x.GameId, x.PlayerId }).Distinct().ToListAsync();
            var ListOfBansSnl = ListOfBans.Select(x => new { x.MatchupId, x.GameId, x.IgBan1Id, x.IgBan2Id, x.IgBan3Id, x.IgBan4Id, x.IgBan5Id, x.IgBan6Id, x.IgBan7Id, x.IgBan8Id, x.IgBan9Id, x.IgBan10Id }).Distinct().ToList();
            var ListOfBansPlayer = ListOfBans.Where(x => x.PlayerId == playerID).ToList();
            //List of all Bans.
            List<int?> bannedGodsInSNL = new List<int?>();
            List<int?> bannedGodsInPlayerMatches = new List<int?>();
            //add all banned gods to 1 list
            ListOfBansSnl.ForEach(x => bannedGodsInSNL.AddRange(new List<int?> { x.IgBan1Id, x.IgBan2Id, x.IgBan3Id, x.IgBan4Id, x.IgBan5Id, x.IgBan6Id, x.IgBan7Id, x.IgBan8Id, x.IgBan9Id, x.IgBan10Id }));
            ListOfBansPlayer.ForEach(x => bannedGodsInPlayerMatches.AddRange(new List<int?> { x.IgBan1Id, x.IgBan2Id, x.IgBan3Id, x.IgBan4Id, x.IgBan5Id, x.IgBan6Id, x.IgBan7Id, x.IgBan8Id, x.IgBan9Id, x.IgBan10Id }));
            //SNL total
            var ListOfBannedGodsAndTheirBanCountSNL = bannedGodsInSNL.GroupBy(r => r)
            .Select(grp => new
            {
                GodId = grp.Key,
                Count = grp.Count()
            }).OrderByDescending(x => x.Count);
            //Player matches
            var ListOfBannedGodsAndTheirBanCountPlayer = bannedGodsInPlayerMatches.GroupBy(r => r)
                .Select(grp => new
                {
                    GodId = grp.Key,
                    Count = grp.Count()
                }).OrderByDescending(x => x.Count);

            foreach (var god in godWithPickPercentages)
            {
                god.TimesBannedInSNL = 0;
                god.TimesBanned = 0;
                god.TimesBannedInSNL += ListOfBannedGodsAndTheirBanCountSNL.Where(x => x.GodId == god.GodId).FirstOrDefault()?.Count;
                god.TimesBanned += ListOfBannedGodsAndTheirBanCountPlayer.Where(x => x.GodId == god.GodId).FirstOrDefault()?.Count;
            }

            return godWithPickPercentages;
        }

        private async Task<List<GodWithPickPercentage>> GetGodWithPickPercentagesForTeamAsync(int? teamID)
        {
            //Get god data and times played for player and SNL total
            List<GodWithPickPercentage> godWithPickPercentages = await _db.TableStats.Join(_db.TableGodDetails, stat => stat.GodPlayedId, god => god.GodId, (stat, god) => new
            {
                GodName = god.GodName,
                GodId = god.GodId,
                GodIconUrl = god.GodIconUrl,
                Stats = stat,
            }).GroupBy(y => y.GodId, (y, z) => new GodWithPickPercentage
            {
                GodId = y,
                GodName = z.Select(g => g.GodName).Min(),
                GodIcon = z.Select(g => g.GodIconUrl).Min(),
                TimesPlayedInSNL = z.Where(s => s.Stats.GodPlayedId == y).Count(),
                TimesPlayed = z.Where(s => s.Stats.GodPlayedId == y && s.Stats.TeamId == teamID).Count(),
            }).OrderBy(x => x.GodName).ToListAsync();


            //Get all ban counts
            var ListOfBans = await _db.TableStats.Select(x => new { x.IgBan1Id, x.IgBan2Id, x.IgBan3Id, x.IgBan4Id, x.IgBan5Id, x.IgBan6Id, x.IgBan7Id, x.IgBan8Id, x.IgBan9Id, x.IgBan10Id, x.MatchupId, x.GameId, x.TeamId }).Distinct().ToListAsync();
            var ListOfBansSnl = ListOfBans.Select(x => new { x.MatchupId, x.GameId, x.IgBan1Id, x.IgBan2Id, x.IgBan3Id, x.IgBan4Id, x.IgBan5Id, x.IgBan6Id, x.IgBan7Id, x.IgBan8Id, x.IgBan9Id, x.IgBan10Id }).Distinct().ToList();
            var ListOfBansTeam = ListOfBans.Where(x => x.TeamId == teamID).ToList();
            //List of all Bans.
            List<int?> bannedGodsInSNL = new List<int?>();
            List<int?> bannedGodsInPlayerMatches = new List<int?>();
            //add all banned gods to 1 list
            ListOfBansSnl.ForEach(x => bannedGodsInSNL.AddRange(new List<int?> { x.IgBan1Id, x.IgBan2Id, x.IgBan3Id, x.IgBan4Id, x.IgBan5Id, x.IgBan6Id, x.IgBan7Id, x.IgBan8Id, x.IgBan9Id, x.IgBan10Id }));
            ListOfBansTeam.ForEach(x => bannedGodsInPlayerMatches.AddRange(new List<int?> { x.IgBan1Id, x.IgBan2Id, x.IgBan3Id, x.IgBan4Id, x.IgBan5Id, x.IgBan6Id, x.IgBan7Id, x.IgBan8Id, x.IgBan9Id, x.IgBan10Id }));
            //SNL total
            var ListOfBannedGodsAndTheirBanCountSNL = bannedGodsInSNL.GroupBy(r => r)
            .Select(grp => new
            {
                GodId = grp.Key,
                Count = grp.Count()
            }).OrderByDescending(x => x.Count);
            //Team matches
            var ListOfBannedGodsAndTheirBanCountPlayer = bannedGodsInPlayerMatches.GroupBy(r => r)
                .Select(grp => new
                {
                    GodId = grp.Key,
                    Count = grp.Count()
                }).OrderByDescending(x => x.Count);

            foreach (var god in godWithPickPercentages)
            {
                god.TimesBannedInSNL = 0;
                god.TimesBanned = 0;
                god.TimesBannedInSNL += ListOfBannedGodsAndTheirBanCountSNL.Where(x => x.GodId == god.GodId).FirstOrDefault()?.Count;
                god.TimesBanned += ListOfBannedGodsAndTheirBanCountPlayer.Where(x => x.GodId == god.GodId).FirstOrDefault()?.Count;
            }

            return godWithPickPercentages;
        }
        #endregion
    }
}
