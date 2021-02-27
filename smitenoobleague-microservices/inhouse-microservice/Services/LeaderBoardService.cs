using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using inhouse_microservice.Interfaces;
using inhouse_microservice.Models.External;
using inhouse_microservice.Inhouse_DB;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using inhouse_microservice.Models.Internal;

namespace inhouse_microservice.Services
{
    public class LeaderBoardService : ILeaderboardService
    {
        private readonly SNL_Inhouse_DBContext  _db;
        private readonly ILogger<LeaderBoardService> _logger;

        public LeaderBoardService(SNL_Inhouse_DBContext db, ILogger<LeaderBoardService> logger)
        {
            _db = db;
            _logger = logger;
        }


        public async Task<ActionResult<LeaderboardData>> GetInhouseLeaderboardDataAsync()
        {
            try
            {
                if (await _db.TableStats.CountAsync() > 0)
                {
                    LeaderboardData leaderboardData = new LeaderboardData
                    {
                        Kills = await GetTopKillsAsync(10),
                        Assists = await GetTopAssistsAsync(10),
                        Deaths = await GetTopDeathsAsync(10),
                        DamageDealt = await GetTopDamageDealtAsync(10),
                        Healing = await GetTopHealingAsync(10),
                        DamageMitigated = await GetTopDamageMitigatedAsync(10),
                        DamageTaken = await GetTopDamageTakenAsync(10),
                        Top10DamageAndRemainingInPercentage = await GetTop10DamageAndRemainderAsync(),
                        Top5KdaPlayers = await GetTop5KdaAsync(),
                        KillParticipation = await GetTopKillParticipationAsync(10)
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

        public async Task<ActionResult<LeaderboardData>> GetInhouseLeaderboardDataLandingPageAsync()
        {
            try
            {
                if (await _db.TableStats.CountAsync() > 0)
                {
                    LeaderboardData leaderboardData = new LeaderboardData
                    {
                        DamageDealt = await GetAverageDamageDealtAsync(5),
                        DamageMitigated = await GetAverageDamageMitigatedAsync(5),
                        Top5KdaPlayers = await GetTop5AverageKdaAsync(),
                        KillParticipation = await GetAverageKillParticipationAsync(5)
                    };

                    return new ObjectResult(leaderboardData) { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No game data yet to base stats off") { StatusCode = 404 }; //OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get leaderboard data.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get leaderboard data.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        #region methods
        private async Task<List<LeaderboardEntry>> GetTopKillsAsync(int amount)
        {
            //Group all stats by playerID then get the top 10 players with the most kills
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry {
                Player = new LeaderboardPlayer {PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value  },
                Score = y.Select(z => z.IgKills).Sum()
            }).OrderByDescending(x => x.Score).Take(amount).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTopAssistsAsync(int amount)
        {
            //Group all stats by playerID then get the top 10 players with the most assists
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = y.Select(z => z.IgAssists).Sum()
            }).OrderByDescending(x => x.Score).Take(amount).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTopDeathsAsync(int amount)
        {
            //Group all stats by playerID then get the top 10 players with the most deaths
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = y.Select(z => z.IgDeaths).Sum()
            }).OrderByDescending(x => x.Score).Take(amount).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTopDamageDealtAsync(int amount)
        {
            //Group all stats by playerID then get the top 10 players with the most damage dealt
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = y.Select(z => z.IgDamageDealt).Sum()
            }).OrderByDescending(x => x.Score).Take(amount).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTop10DamageAndRemainderAsync()
        {
            //total damage dealt
            int? totalDamage = await _db.TableStats.Select(x => x.IgDamageDealt).SumAsync();

            var top10DamageDealers = await GetTopDamageDealtAsync(10);

            var Top10Damage = top10DamageDealers.Select(x => x.Score).Sum();

            //Score to %
            top10DamageDealers.ForEach(x => x.Score = (int)((double)x.Score / (double)totalDamage * 100));
            top10DamageDealers.Add(new LeaderboardEntry { Player = new LeaderboardPlayer { Playername = "The rest of the InHouse players" }, Score = (int)((double)(totalDamage - Top10Damage) / (double)totalDamage * 100) });
            
            return top10DamageDealers;
        }
        private async Task<List<LeaderboardEntry>> GetTopHealingAsync(int amount)
        {
            //Group all stats by playerID then get the top 10 players with the most healing
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = y.Select(z => z.IgHealing).Sum()
            }).OrderByDescending(x => x.Score).Take(amount).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTopDamageMitigatedAsync(int amount)
        {
            //Group all stats by playerID then get the top 10 players with the most damage mitigated
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = y.Select(z => z.IgDamageMitigated).Sum()
            }).OrderByDescending(x => x.Score).Take(amount).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTopDamageTakenAsync(int amount)
        {
            //Group all stats by playerID then get the top 10 players with the most damage taken
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = y.Select(z => z.IgDamageTaken).Sum()
            }).OrderByDescending(x => x.Score).Take(amount).ToListAsync();
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
                Score = Math.Round(((double)y.Select(z => z.IgKills).Sum() + (double)y.Select(z => z.IgAssists).Sum()) / (double)y.Select(z => z.IgDeaths).Sum(),2)
            }).OrderByDescending(x => x.Score).Take(5).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry_Double>> GetTopKillParticipationAsync(int amount)
        {
            //Group all stats by playerID then get the top 10 players with the most damage taken
            List<LeaderboardEntry_Double> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry_Double
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = Math.Round((double)(y.Select(z => z.IgKills).Sum() + y.Select(z => z.IgAssists).Sum()) / (double)y.Select(z => z.TotalKillsTeam).Sum() * 100)
            }).OrderByDescending(x => x.Score).Take(amount).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        //Average
        private async Task<List<LeaderboardEntry_Double>> GetAverageKillParticipationAsync(int amount)
        {
            //Group all stats by playerID then get the top 10 players with the most damage taken
            List<LeaderboardEntry_Double> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry_Double
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = Math.Round((double)(y.Select(z => z.IgKills).Average() + y.Select(z => z.IgAssists).Average()) / (double)y.Select(z => z.TotalKillsTeam).Average() * 100)
            }).OrderByDescending(x => x.Score).Take(amount).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetAverageDamageMitigatedAsync(int amount)
        {
            //Group all stats by playerID then get the top 10 players with the most damage mitigated
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = (int)y.Select(z => z.IgDamageMitigated).Average()
            }).OrderByDescending(x => x.Score).Take(amount).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry_Double>> GetTop5AverageKdaAsync()
        {
            //Group all stats by playerID then get the top 10 players with the best KDA
            List<LeaderboardEntry_Double> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry_Double
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = Math.Round(((double)y.Select(z => z.IgKills).Average() + (double)y.Select(z => z.IgAssists).Average()) / (double)y.Select(z => z.IgDeaths).Average(), 2)
            }).OrderByDescending(x => x.Score).Take(5).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetAverageDamageDealtAsync(int amount)
        {
            //Group all stats by playerID then get the top 10 players with the most damage dealt
            List<LeaderboardEntry> leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
            {
                Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                Score = (int)y.Select(z => z.IgDamageDealt).Average()
            }).OrderByDescending(x => x.Score).Take(amount).ToListAsync();
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        #endregion
    }
}
