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
                
                if (foundPlayer != null || await _db.TableStats.Where(x => x.PlayerId == playerID).CountAsync() > 0)
                {
                    //List<TableStat> foundStats = await _db.TableStats.Where(ts => ts.PlayerId == playerID).ToListAsync();
                    //Get stats, probably best to calculate stats with sql as much as possible to make it faster
                    List<PlayerMatchesStats> playerMatchesStats = await GetStatsFromPlayerMatchesAsync(playerID);
                    List<GodStatistics> playerGodStats = await GetStatsPerGodByPlayerIdFromDbAsync(playerID, playerMatchesStats);
                    PlayerStatistics playerStats = await GetPlayerStatByPlayerIdFromDbAsync(playerID, playerMatchesStats);
                    if (playerStats != null)
                    {
                        var playerData = await _db.TableStats.Where(x => x.PlayerId == playerID).Select(x => new { name = x.PlayerName, platform = ((ApiPlatformEnum)x.PlayerPlatformId).ToString()}).FirstOrDefaultAsync();
                        playerStats.Player = foundPlayer?.Player != null ? foundPlayer.Player : new TeamMember {TeamMemberName = playerData.name, TeamMemberPlatform = playerData.platform, PlayerID = (int)playerID  };
                        playerStats.Team = foundPlayer?.Team;
                        playerStats.BestPicks = GetTop5BestGodsAsync(playerGodStats);
                        playerStats.MostPicked = GetTop5MostPickedGodsAsync(playerGodStats);
                        playerStats.HighestDamageGods = GetTopHighestDamageGods(playerGodStats);
                    }
                    else
                    {
                        playerStats = new PlayerStatistics {
                            Player = foundPlayer?.Player,
                            Team = foundPlayer?.Team,
                            BestPicks = new List<GodStatistics> { new GodStatistics { }, new GodStatistics { }, new GodStatistics { }, new GodStatistics { }, new GodStatistics { } },
                            TopBansAgainst = new List<God> { new God { }, new God { }, new God { }, new God { }, new God { } },
                            MostPicked = new List<GodWithTimesPlayed> { new GodWithTimesPlayed { }, new GodWithTimesPlayed { }, new GodWithTimesPlayed { }, new GodWithTimesPlayed { }, new GodWithTimesPlayed { } }
                        };
                    }

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

        #region methods
        private async Task<List<PlayerMatchesStats>> GetStatsFromPlayerMatchesAsync(int? playerID)
        {
            //all match id's the player is in
            List<int?> playerMatchesListOfIds = await _db.TableStats.Where(ts => ts.PlayerId == playerID).Select(x => x.GameId).ToListAsync();
            List<PlayerMatchesStats> playerMatchesStats = await _db.TableStats.Where(t => playerMatchesListOfIds.Contains(t.GameId)).GroupBy(x => x.GameId, (x, y) => new PlayerMatchesStats{
                GameId = x,
                GodPlayedId = y.Where(z => z.PlayerId == playerID).Select(z => z.GodPlayedId).Min(),
                TotalKillsPlayerTeam = y.Where(z => z.PlayerId == playerID).Select(s => s.IgTaskforce).Min() == 1 ? y.Where(z => z.IgTaskforce == 1).Select(z => z.IgKills).Sum() : y.Where(z => z.IgTaskforce == 2).Select(z => z.IgKills).Sum(),
                BansEnemyTeam = y.Where(z => z.PlayerId == playerID).Select(s => s.IgTaskforce).Min() == 1 ?
                new List<int?> { y.Select(z => z.IgBan2Id).Min(), y.Select(z => z.IgBan4Id).Min(), y.Select(z => z.IgBan6Id).Min(), y.Select(z => z.IgBan8Id).Min(), y.Select(z => z.IgBan10Id).Min() } :
                new List<int?> { y.Select(z => z.IgBan1Id).Min(), y.Select(z => z.IgBan3Id).Min(), y.Select(z => z.IgBan5Id).Min(), y.Select(z => z.IgBan7Id).Min(), y.Select(z => z.IgBan9Id).Min() },
            }).ToListAsync();

            return playerMatchesStats;
        }
        private async Task<List<GodStatistics>> GetStatsPerGodByPlayerIdFromDbAsync(int? playerID, List<PlayerMatchesStats> playerMatchesStats)
        {
            List<GodStatistics> GodStatList = await _db.TableStats.Join(_db.TableGodDetails, stat => stat.GodPlayedId, god => god.GodId, (stat, god) => new
            {
                GodName = god.GodName,
                GodId = god.GodId,
                GodIconUrl = god.GodIconUrl,
                Stats = stat
            }).Where(x => x.Stats.PlayerId == playerID).GroupBy(y => y.GodId, (y, z) => new GodStatistics
            {
                God = new God { GodId = y, GodName = z.Select(g => g.GodName).Min(), GodIcon = z.Select(g => g.GodIconUrl).Min() },
                //Totals
                TotalKills = z.Select(s => s.Stats.IgKills).Sum(),
                TotalDeaths = z.Select(s => s.Stats.IgDeaths).Sum(),
                TotalAssists = z.Select(s => s.Stats.IgAssists).Sum(),
                TotalGoldEarned = z.Select(s => s.Stats.IgGoldEarned).Sum(),
                TotalFirstBloods = z.Select(s => s.Stats.IgFirstBlood).Where(s => s.Value == true).Count(),
                TotalGamesPlayed = z.Count(),
                TotalStructureDamage = z.Select(s => s.Stats.IgStructureDamage).Sum(),
                TotalDamageDealt = z.Select(s => s.Stats.IgDamageDealt).Sum(),
                TotalDamageMitigated = z.Select(s => s.Stats.IgDamageMitigated).Sum(),
                TotalDamageTaken = z.Select(s => s.Stats.IgDamageTaken).Sum(),
                TotalWins = z.Select(s => s.Stats.WinStatus).Where(s => s.Value == true).Count(),
                //Highest achieved stats
                HighestKillingSpree = z.Select(s => s.Stats.IgKillingSpree).Max(),
                HighestGoldEarned = z.Select(s => s.Stats.IgGoldEarned).Max(),
                HighestKda = z.Select(s => ((double)s.Stats.IgKills + (double)s.Stats.IgAssists) / (double)s.Stats.IgDeaths).Max(),
                HighestGpm = z.Select(s => s.Stats.IgGpm).Max(),
                //Average achieved stats
                //AverageKillParticipation = ((double)z.Select(s => s.Stats.IgKills).Sum() + (double)z.Select(s => s.Stats.IgAssists).Sum()) / (double)playerMatchesStats.Select(x => x.TotalKillsPlayerTeam).Sum() * 100,
                AverageGPM = z.Select(s => s.Stats.IgGpm).Average(),
                AverageKda = Math.Round(z.Select(s => ((double)s.Stats.IgKills + (double)s.Stats.IgAssists) / (s.Stats.IgDeaths.Value > 0 ? (double)s.Stats.IgDeaths : 1)).Average(),2),
                AverageKills = z.Select(s => s.Stats.IgKills).Average(),
                AverageDeaths = z.Select(s => s.Stats.IgDeaths).Average(),
                AverageAssists = z.Select(s => s.Stats.IgAssists).Average(),
                AverageStructureDamage = z.Select(s => s.Stats.IgStructureDamage).Average(),
                AverageDamageDealt = z.Select(s => s.Stats.IgDamageDealt).Average(),
                AverageDamageMitigated = z.Select(s => s.Stats.IgDamageMitigated).Average(),
                AverageDamageTaken = z.Select(s => s.Stats.IgDamageTaken).Average(),
            }).ToListAsync();
            //Add avg kill participation to each god
            foreach(var god in GodStatList)
            {
                double killassists = (double)god.TotalKills + (double)god.TotalAssists;
                double totalKillsByTeam = (double)playerMatchesStats.Where(z => z.GodPlayedId == god.God.GodId).Select(z => z.TotalKillsPlayerTeam).Sum();
                double avgkp = Math.Round(killassists / (totalKillsByTeam != 0 ? totalKillsByTeam : 1) * 100);
                god.AverageKillParticipation = avgkp;
            }

            return GodStatList;
        }
        private async Task<PlayerStatistics> GetPlayerStatByPlayerIdFromDbAsync(int? playerID, List<PlayerMatchesStats> playerMatchesStats)
        {
            PlayerStatistics PlayerStats = await _db.TableStats.Where(x => x.PlayerId == playerID).GroupBy(y => y.PlayerId, (y, z) => new PlayerStatistics
            {
                AverageKillParticipation = (int)(((double)z.Select(s => s.IgKills).Sum() + (double)z.Select(s => s.IgAssists).Sum()) / ((double)playerMatchesStats.Select(x => x.TotalKillsPlayerTeam).Sum() != 0 ? (double)playerMatchesStats.Select(x => x.TotalKillsPlayerTeam).Sum() : 1) * 100),
                AverageAssists = (int)z.Select(s => s.IgAssists).Average(),
                AverageDamageDealt = (int)z.Select(s => s.IgDamageDealt).Average(),
                AverageKills = (int)z.Select(s => s.IgKills).Average(),
                AverageDeaths = (int)z.Select(s => s.IgDeaths).Average(),
                AverageDamageTaken = (int)z.Select(s => s.IgDamageTaken).Average(),
                AverageDamageMitigated = (int)z.Select(s => s.IgDamageMitigated).Average(),
                GamesPlayed = z.Count(),
                Losses = z.Where(s => s.WinStatus == false).Count(),
                Wins = z.Where(s => s.WinStatus == true).Count(),
                TotalWardsPlaced = (int)z.Select(s => s.IgWardsPlaced).Sum(),
                TotalAssists = (int)z.Select(s => s.IgAssists).Sum(),
                TotalDamageDealt = (int)z.Select(s => s.IgDamageDealt).Sum(),
                TotalDamageTaken = (int)z.Select(s => s.IgDamageTaken).Sum(),
                TotalStructureDamage = (int)z.Select(s => s.IgStructureDamage).Sum(),
                TotalDamageMitigated = (int)z.Select(s => s.IgDamageMitigated).Sum(),
                TotalDeaths = (int)z.Select(s => s.IgDeaths).Sum(),
                TotalDistanceTravelled = (int)z.Select(s => s.IgDistanceTraveled).Sum(),
                TotalKills = (int)z.Select(s => s.IgKills).Sum(),
                TotalHealing = (int)z.Select(s => s.IgHealing).Sum(),
                TotalGoldEarned = (int)z.Select(s => s.IgGoldEarned).Sum(),
            }).FirstOrDefaultAsync();

            if (PlayerStats != null)
            {
                //Get the last 6 played gods
                PlayerStats.RecentPicks = await _db.TableStats.Join(_db.TableGodDetails, stat => stat.GodPlayedId, god => god.GodId, (stat, god) => new
                {
                    GodName = god.GodName,
                    GodId = god.GodId,
                    GodIconUrl = god.GodIconUrl,
                    Stats = stat
                }).Where(x => x.Stats.PlayerId == playerID).GroupBy(y => y.GodId, (y, z) => new
                {
                    God = new God { GodId = y, GodName = z.Select(g => g.GodName).Min(), GodIcon = z.Select(g => g.GodIconUrl).Min() },
                    LastDatePlayed = z.Select(s => s.Stats.MatchPlayedDate).Max()
                }).OrderByDescending(x => x.LastDatePlayed).Select(x => x.God).Take(6).ToListAsync();

                //Most banned against. modify this to contain only gods that are played atleast 7% in their role
                List<int?> bannedGods = new List<int?>();
                //add all banned gods to 1 list
                playerMatchesStats.ForEach(x => bannedGods.AddRange(x.BansEnemyTeam));
                var top5BannedGods = bannedGods.GroupBy(r => r)
                    .Select(grp => new
                    {
                        Value = grp.Key,
                        Count = grp.Count()
                    }).OrderByDescending(x => x.Count).Take(5);
                var godsFromDb = await _db.TableGodDetails.Where(x => top5BannedGods.Select(y => y.Value).ToList().Contains(x.GodId)).ToListAsync();
                if (godsFromDb?.Count() > 0)
                {
                    PlayerStats.TopBansAgainst = godsFromDb.Join(top5BannedGods, godtable => godtable.GodId, top5 => top5.Value, (godtable, top5) => new { God = new God { GodId = godtable.GodId, GodName = godtable.GodName, GodIcon = godtable.GodIconUrl }, BanCount = top5.Count }).OrderByDescending(x => x.BanCount).Select(x => x.God).ToList();
                }
            }

            return PlayerStats;
        }
        private List<GodStatistics> GetTop5BestGodsAsync(List<GodStatistics> godStats)
        {
            //Order by win percentage, then by average Kill participation, then by average gpm, then average by Kda
            List<GodStatistics> top5Gods = godStats.OrderByDescending(x => (double)x.TotalWins / (double)x.TotalGamesPlayed * 100).ThenByDescending(x => x.AverageKillParticipation).ThenByDescending(x => x.AverageGPM).ThenByDescending(x => x.AverageKda).Take(5).ToList();

            //add extra entries so it always returns a list of 5
            if (top5Gods.Count() < 5)
            {
                for (int i = top5Gods.Count(); i < 5; i++)
                {
                    top5Gods.Add(new GodStatistics {God = new God { GodIcon = null, GodId = null, GodName = null } });
                }
            }

            return top5Gods;
        }
        private List<GodWithDamage> GetTopHighestDamageGods(List<GodStatistics> godStats)
        {
            List<GodWithDamage> topDamageGods = godStats.OrderByDescending(x => x.TotalDamageDealt).Take(4).Select(y => new GodWithDamage {GodName = y.God.GodName, GodId = y.God.GodId, GodIcon = y.God.GodIcon, DamageDealt = y.TotalDamageDealt }).ToList();

            return topDamageGods;
        }
        private List<GodWithTimesPlayed> GetTop5MostPickedGodsAsync(List<GodStatistics> playerGodStats)
        {
            List<GodWithTimesPlayed> mostPicked = playerGodStats.OrderByDescending(x => x.TotalGamesPlayed).Take(5).Select(x => new GodWithTimesPlayed {GodName = x.God.GodName, GodId = x.God.GodId, GodIcon = x.God.GodIcon, TimesPlayed = x.TotalGamesPlayed }).ToList();

            //add extra entries so it always returns a list of 5
            if (mostPicked.Count() < 5)
            {
                for (int i = mostPicked.Count(); i < 5; i++)
                {
                    mostPicked.Add(new GodWithTimesPlayed { GodIcon = null, GodId = null, GodName = null, TimesPlayed = null });
                }
            }

            return mostPicked;
        }
        #endregion
    }
}
