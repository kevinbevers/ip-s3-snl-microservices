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
    public class LeaderBoardService : ILeaderboardService
    {
        private readonly SNL_Stat_DBContext _db;
        private readonly ILogger<LeaderBoardService> _logger;
        private readonly IExternalServices _externalServices;

        public LeaderBoardService(SNL_Stat_DBContext db, ILogger<LeaderBoardService> logger, IExternalServices externalServices)
        {
            _db = db;
            _logger = logger;
            _externalServices = externalServices;
        }


        public async Task<ActionResult<LeaderboardData>> GetLeaderboardDataAsync()
        {
            try
            {
                if (await _db.TableStats.CountAsync() > 0)
                {
                    LeaderboardData leaderboardData = new LeaderboardData
                    {
                        Kills = await GetTop10KillsAsync(),
                        Assists = await GetTop10AssistsAsync(),
                        Deaths = await GetTop10DeathsAsync(),
                        DamageDealt = await GetTop10DamageDealtAsync(),
                        Healing = await GetTop10HealingAsync(),
                        DamageMitigated = await GetTop10DamageMitigatedAsync(),
                        DamageTaken = await GetTop10DamageTakenAsync(),
                        Top4DamageAndRemainingInPercentage = await GetTop4DamageAndRemainderAsync(),
                        Top5KdaPlayers = await GetTop5KdaAsync(),
                        KillParticipation = await GetTop10KillParticipationAsync()
                    };

                    return new ObjectResult(leaderboardData) { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No game data yet to base stats off") { StatusCode = 404 }; //OK
                }
            }
            catch(Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get leaderboard data.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get leaderboard data.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        #region methods
        private async Task<List<LeaderboardEntry>> GetTop10KillsAsync()
        {
            //Group all stats by playerID then get the top 10 players with the most kills
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry {
                Player = new LeaderboardPlayer {PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value  },
                Score = y.Select(z => z.IgKills).Sum()
            }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTop10AssistsAsync()
        {
            //Group all stats by playerID then get the top 10 players with the most assists
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = y.Select(z => z.IgAssists).Sum()
            }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTop10DeathsAsync()
        {
            //Group all stats by playerID then get the top 10 players with the most deaths
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = y.Select(z => z.IgDeaths).Sum()
            }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTop10DamageDealtAsync()
        {
            //Group all stats by playerID then get the top 10 players with the most damage dealt
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = y.Select(z => z.IgDamageDealt).Sum()
            }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTop4DamageDealtAsync()
        {
            //Group all stats by playerID then get the top 4 players with the most damage dealt
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = y.Select(z => z.IgDamageDealt).Sum()
            }).OrderByDescending(x => x.Score).Take(4).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTop4DamageAndRemainderAsync()
        {
            //total damage dealt
            int? totalDamage = await _db.TableStats.Select(x => x.IgDamageDealt).SumAsync();

            var top4DamageDealers = await GetTop4DamageDealtAsync();

            var Top4Damage = top4DamageDealers.Select(x => x.Score).Sum();

            //Score to %
            top4DamageDealers.ForEach(x => x.Score = (int)((double)x.Score / (double)totalDamage * 100));
            top4DamageDealers.Add(new LeaderboardEntry { Player = new LeaderboardPlayer { Playername = "The rest of the SNL" }, Score = (int)((double)(totalDamage - Top4Damage) / (double)totalDamage * 100) });
            
            return top4DamageDealers;
        }
        private async Task<List<LeaderboardEntry>> GetTop10HealingAsync()
        {
            //Group all stats by playerID then get the top 10 players with the most healing
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = y.Select(z => z.IgHealing).Sum()
            }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTop10DamageMitigatedAsync()
        {
            //Group all stats by playerID then get the top 10 players with the most damage mitigated
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = y.Select(z => z.IgDamageMitigated).Sum()
            }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTop10DamageTakenAsync()
        {
            //Group all stats by playerID then get the top 10 players with the most damage taken
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = y.Select(z => z.IgDamageTaken).Sum()
            }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry_Double>> GetTop5KdaAsync()
        {
            //Group all stats by playerID then get the top 10 players with the best KDA
            List<LeaderboardEntry_Double> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry_Double
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = Math.Round((double)y.Select(z => z.IgKills).Sum() + (double)y.Select(z => z.IgAssists).Sum()) / (double)y.Select(z => z.IgDeaths).Sum()
            }).OrderByDescending(x => x.Score).Take(5).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry_Double>> GetTop10KillParticipationAsync()
        {
            //Group all stats by playerID then get the top 10 players with the most damage taken
            List<LeaderboardEntry_Double> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry_Double
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = Math.Round((double)(y.Select(z => z.IgKills).Sum() + y.Select(z => z.IgAssists).Sum()) / (double)y.Select(z => z.TotalKillsTeam).Sum() * 100)
            }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        #endregion
    }
}
