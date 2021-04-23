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


        public async Task<ActionResult<LeaderboardData>> GetLeaderboardDataAsync(int? divisionID)
        {
            try
            {
                if (await _db.TableStats.CountAsync() > 0)
                {
                    LeaderboardData leaderboardData = new LeaderboardData
                    {
                        Kills = await GetTop10KillsAsync(divisionID),
                        Assists = await GetTop10AssistsAsync(divisionID),
                        Deaths = await GetTop10DeathsAsync(divisionID),
                        DamageDealt = await GetTop10DamageDealtPerMinuteAsync(divisionID),
                        Healing = await GetTop10HealingPerMinuteAsync(divisionID),
                        DamageMitigated = await GetTop10DamageMitigatedPerMinuteAsync(divisionID),
                        DamageTaken = await GetTop10DamageTakenPerMinuteAsync(divisionID),
                        Top10DamageAndRemainingInPercentage = await GetTop10DamageAndRemainderAsync(divisionID),
                        Top5KdaPlayers = await GetTop5KdaAsync(divisionID),
                        KillParticipation = await GetTop10KillParticipationAsync(divisionID)
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
        private async Task<List<LeaderboardEntry>> GetTop10KillsAsync(int? divisionID)
        {
            List<LeaderboardEntry> leaderboardEntries = new List<LeaderboardEntry>();

            if (divisionID != null)
            {
                //Group all stats by playerID then get the top 10 players with the most kills
                leaderboardEntries = await _db.TableStats.Where(x => x.DivisionId == divisionID).GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgKills).Sum()
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            else
            {
                //Group all stats by playerID then get the top 10 players with the most kills
                leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgKills).Sum()
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTop10AssistsAsync(int? divisionID)
        {
            List<LeaderboardEntry> leaderboardEntries = new List<LeaderboardEntry>();

            if (divisionID != null)
            {
                //Group all stats by playerID then get the top 10 players with the most assists
                leaderboardEntries = await _db.TableStats.Where(x => x.DivisionId == divisionID).GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgAssists).Sum()
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            else
            {
                //Group all stats by playerID then get the top 10 players with the most assists
                leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgAssists).Sum()
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTop10DeathsAsync(int? divisionID)
        {
            List<LeaderboardEntry> leaderboardEntries = new List<LeaderboardEntry>();

            if (divisionID != null)
            {
                //Group all stats by playerID then get the top 10 players with the most deaths
                leaderboardEntries = await _db.TableStats.Where(x => x.DivisionId == divisionID).GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgDeaths).Sum()
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            else
            {
                //Group all stats by playerID then get the top 10 players with the most deaths
                leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgDeaths).Sum()
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry_Double>> GetTop10DamageDealtAsync(int? divisionID)
        {
            List<LeaderboardEntry_Double> leaderboardEntries = new List<LeaderboardEntry_Double>();

            if (divisionID != null)
            {
                //Group all stats by playerID then get the top 10 players with the most damage dealt
                leaderboardEntries = await _db.TableStats.Where(x => x.DivisionId == divisionID).GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry_Double
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgDamageDealt).Sum()
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            else
            {
                //Group all stats by playerID then get the top 10 players with the most damage dealt
                leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry_Double
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgDamageDealt).Sum()
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTop10DamageDealtPerMinuteAsync(int? divisionID)
        {
            List<LeaderboardEntry> leaderboardEntries = new List<LeaderboardEntry>();

            if (divisionID != null)
            {
                //Group all stats by playerID then get the top 10 players with the most damage dealt per minute
                leaderboardEntries = await _db.TableStats.Where(x => x.DivisionId == divisionID).GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgDamageDealt).Sum() / (y.Select(z => z.IgMatchLengthInSeconds).Sum() / 60)
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            else
            {
                //Group all stats by playerID then get the top 10 players with the most damage dealt per minute
                leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgDamageDealt).Sum() / (y.Select(z => z.IgMatchLengthInSeconds).Sum() / 60)
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry_Double>> GetTop10DamageAndRemainderAsync(int? divisionID)
        {
            //total damage dealt
            int? totalDamage = await _db.TableStats.Select(x => x.IgDamageDealt).SumAsync();

            var top10DamageDealers = await GetTop10DamageDealtAsync(divisionID);

            var Top10Damage = top10DamageDealers.Select(x => x.Score).Sum();

            //Score to %
            top10DamageDealers.ForEach(x => { x.Score = Math.Round(((double)x.Score / (double)totalDamage * 100), 2); } );

            if (divisionID != null)
            {
                top10DamageDealers.Add(new LeaderboardEntry_Double { Player = new LeaderboardPlayer { Playername = "The rest of the Division" }, Score = Math.Round(((double)(totalDamage - Top10Damage) / (double)totalDamage * 100),2) });
            }
            else
            {
                top10DamageDealers.Add(new LeaderboardEntry_Double { Player = new LeaderboardPlayer { Playername = "The rest of the SNL" }, Score = (int)((double)(totalDamage - Top10Damage) / (double)totalDamage * 100) });
            }
            
            return top10DamageDealers;
        }
        private async Task<List<LeaderboardEntry>> GetTop10HealingPerMinuteAsync(int? divisionID)
        {
            List<LeaderboardEntry> leaderboardEntries = new List<LeaderboardEntry>();

            if (divisionID != null)
            {
                //Group all stats by playerID then get the top 10 players with the most healing
                leaderboardEntries = await _db.TableStats.Where(x => x.DivisionId == divisionID).GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgHealing).Sum() / (y.Select(z => z.IgMatchLengthInSeconds).Sum() / 60)
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            else
            {
                //Group all stats by playerID then get the top 10 players with the most healing
                leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgHealing).Sum() / (y.Select(z => z.IgMatchLengthInSeconds).Sum() / 60)
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTop10DamageMitigatedPerMinuteAsync(int? divisionID)
        {
            List<LeaderboardEntry> leaderboardEntries = new List<LeaderboardEntry>();

            if (divisionID != null)
            {
                //Group all stats by playerID then get the top 10 players with the most damage mitigated
                leaderboardEntries = await _db.TableStats.Where(x => x.DivisionId == divisionID).GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgDamageMitigated).Sum() / (y.Select(z => z.IgMatchLengthInSeconds).Sum() / 60)
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            else
            {
                //Group all stats by playerID then get the top 10 players with the most damage mitigated
                leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgDamageMitigated).Sum() / (y.Select(z => z.IgMatchLengthInSeconds).Sum() / 60)
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry>> GetTop10DamageTakenPerMinuteAsync(int? divisionID)
        {
            List<LeaderboardEntry> leaderboardEntries = new List<LeaderboardEntry>();

            if (divisionID != null)
            {
                //Group all stats by playerID then get the top 10 players with the most damage taken
                leaderboardEntries = await _db.TableStats.Where(x => x.DivisionId == divisionID).GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgDamageTaken).Sum() / (y.Select(z => z.IgMatchLengthInSeconds).Sum() / 60)
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            else
            {
                //Group all stats by playerID then get the top 10 players with the most damage taken
                leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = y.Select(z => z.IgDamageTaken).Sum() / (y.Select(z => z.IgMatchLengthInSeconds).Sum() / 60)
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry_Double>> GetTop5KdaAsync(int? divisionID)
        {
            List<LeaderboardEntry_Double> leaderboardEntries = new List<LeaderboardEntry_Double>();

            if (divisionID != null)
            {
                //Group all stats by playerID then get the top 10 players with the best KDA
                leaderboardEntries = await _db.TableStats.Where(x => x.DivisionId == divisionID).GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry_Double
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = Math.Round(((double)y.Select(z => z.IgKills).Sum() + (double)y.Select(z => z.IgAssists).Sum()) / (y.Select(z => z.IgDeaths).Sum() > 0 ? (double)y.Select(z => z.IgDeaths).Sum() : 1), 2)
                }).OrderByDescending(x => x.Score).Take(5).ToListAsync();
            }
            else
            {
                //Group all stats by playerID then get the top 10 players with the best KDA
                leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry_Double
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = Math.Round(((double)y.Select(z => z.IgKills).Sum() + (double)y.Select(z => z.IgAssists).Sum()) / (y.Select(z => z.IgDeaths).Sum() > 0 ? (double)y.Select(z => z.IgDeaths).Sum() : 1), 2)
                }).OrderByDescending(x => x.Score).Take(5).ToListAsync();
            }
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        private async Task<List<LeaderboardEntry_Double>> GetTop10KillParticipationAsync(int? divisionID)
        {
            List<LeaderboardEntry_Double> leaderboardEntries = new List<LeaderboardEntry_Double>();

            if (divisionID != null)
            {
                //Group all stats by playerID then get the top 10 players with the most damage taken
                leaderboardEntries = await _db.TableStats.Where(x => x.DivisionId == divisionID).GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry_Double
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = Math.Round((double)(y.Select(z => z.IgKills).Sum() + y.Select(z => z.IgAssists).Sum()) / (double)y.Select(z => z.TotalKillsTeam).Sum() * 100)
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            else
            {
                //Group all stats by playerID then get the top 10 players with the most damage taken
                leaderboardEntries = await _db.TableStats.GroupBy(x => x.PlayerId, (x, y) => new LeaderboardEntry_Double
                {
                    Player = new LeaderboardPlayer { PlayerID = x, Playername = y.Select(z => z.PlayerName).Min(), PlatformID = y.Select(z => z.PlayerPlatformId).Min().Value },
                    Score = Math.Round((double)(y.Select(z => z.IgKills).Sum() + y.Select(z => z.IgAssists).Sum()) / (double)y.Select(z => z.TotalKillsTeam).Sum() * 100)
                }).OrderByDescending(x => x.Score).Take(10).ToListAsync();
            }
            //Set the platform name based on the ID
            leaderboardEntries.ForEach(x => x.Player.Platform = ((ApiPlatformEnum)x.Player.PlatformID).ToString());

            return leaderboardEntries;
        }
        #endregion
    }
}
