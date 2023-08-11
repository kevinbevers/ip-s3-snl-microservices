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
                if(teamID == null)
                {
                    return new ObjectResult("Can't find team with given value, please use a team id.") { StatusCode = 400 }; //BAD REQUEST
                }
                TeamWithDetails foundTeam = await _externalServices.GetTeamWithDetailsByTeamId(teamID);
                if (foundTeam != null)
                {
                    //List<TableStat> foundStats = await _db.TableStats.Where(ts => ts.PlayerId == playerID).ToListAsync();
                    //Get stats, probably best to calculate stats with sql as much as possible to make it faster
                    string divisionName = await _externalServices.GetDivisionNameByDivisionID(foundTeam?.DivisionID);
                    List<TeamMatchesStats> teamMatchesStats = await GetStatsFromTeamMatchesAsync(teamID);
                    List<GodStatistics> godStatistics = await GetStatsPerGodByTeamIdFromDbAsync(teamID, teamMatchesStats);
                    TeamStatistics teamStats = await GetTeamStatisticsByTeamIdAsync(teamID, teamMatchesStats);
                    if (teamStats != null)
                    {
                        teamStats.Team = foundTeam;
                        teamStats.DivisionName = divisionName;
                        teamStats.MostPlayed = GetTop5MostPickedGods(godStatistics);
                        teamStats.StarPlayer = await GetStarPlayerId(teamID, teamMatchesStats, foundTeam.TeamMembers);
                        teamStats.RecentPerformanceScore = await GetRecentPerformanceScoreAsync(teamMatchesStats, teamID);
                        teamStats.RecentMatches = await GetPageOfMatchupsByTeamId(teamID, 0);
                        teamStats.MatchHistoryNumberOfPages = (int) Math.Ceiling((double)await _db.TableMatchResults.Where(tmr => tmr.AwayTeamId == teamID || tmr.HomeTeamId == teamID).GroupBy(t => t.ScheduleMatchUpId, (x, y) => new { ScheduleMatchUpId = x, DatePlayed = y.Select(z => z.DatePlayed).Max() }).Select(x => x.ScheduleMatchUpId).Distinct().CountAsync() / 5 );
                    }
                    else
                    {
                        teamStats = new TeamStatistics {
                            Team = foundTeam,
                            DivisionName = divisionName
                        };
                    }

                    return new ObjectResult(teamStats) { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No team found with the given ID.") { StatusCode = 404 }; //OK
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get team stats with team ID.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get team stats with team ID.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<List<RecentMatch>>> GetTeamsMatchHistoryAsync(int? teamID, int page)
        {
            try
            {
                return new ObjectResult(await GetPageOfMatchupsByTeamId(teamID, page)) { StatusCode = 200 }; //OK
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get a page of team matches.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get a page of team matches.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        #region methods
        private async Task<List<TeamMatchesStats>> GetStatsFromTeamMatchesAsync(int? teamID)
        {
            //all match id's the player is in
            List<int?> teamMatchesListOfIds = await _db.TableStats.Where(ts => ts.TeamId == teamID).Select(z => new {z.GameId, z.MatchupId }).Distinct().Select(x => x.GameId).ToListAsync();
            List<TeamMatchesStats> teamMatchesStats = await _db.TableStats.Where(t => teamMatchesListOfIds.Contains(t.GameId) && t.TeamId == teamID).GroupBy(x => x.GameId, (x, y) => new TeamMatchesStats
            {
                GameId = x,
                MatchupId = y.Select(x => x.MatchupId).Min(),
                DatePlayed = y.Select(x => x.MatchPlayedDate).Max(),
                WonMatch = y.Select(x => x.WinStatus).Max(),
                MatchDurationInSeconds = y.Select(x => x.IgMatchLengthInSeconds).Max(),
                TotalDamageDealtInMatch = y.Where(z => z.TeamId == teamID).Select(x => x.IgDamageDealt).Sum(),
                TotalObjectivesTakenInMatch = y.Where(z => z.TeamId == teamID).Select(x => x.IgGoldFuriesKilled).Sum() + y.Select(x => x.IgFireGiantsKilled).Sum(),
                GoldEarnedInMatch = y.Where(z => z.TeamId == teamID).Select(x => x.IgGoldEarned).Sum(),
                TotalAssistsInMatch = y.Where(z => z.TeamId == teamID).Where(z => z.TeamId == teamID).Select(s => s.IgTaskforce).Min() == 1 ? y.Where(z => z.IgTaskforce == 1).Select(z => z.IgAssists).Sum() : y.Where(z => z.IgTaskforce == 2).Select(z => z.IgAssists).Sum(),
                TotalDeathsInMatch = y.Where(z => z.TeamId == teamID).Select(s => s.IgTaskforce).Min() == 1 ? y.Where(z => z.IgTaskforce == 1).Select(z => z.IgDeaths).Sum() : y.Where(z => z.IgTaskforce == 2).Select(z => z.IgDeaths).Sum(),
                TotalKillsTeam = y.Where(z => z.TeamId == teamID).Select(s => s.IgTaskforce).Min() == 1 ? y.Where(z => z.IgTaskforce == 1).Select(z => z.IgKills).Sum() : y.Where(z => z.IgTaskforce == 2).Select(z => z.IgKills).Sum(),
                BansTeam = y.Where(z => z.TeamId == teamID).Select(s => s.IgTaskforce).Min() != 1 ?
                new List<int?> { y.Select(z => z.IgBan2Id).Min(), y.Select(z => z.IgBan4Id).Min(), y.Select(z => z.IgBan6Id).Min(), y.Select(z => z.IgBan8Id).Min(), y.Select(z => z.IgBan10Id).Min() } :
                new List<int?> { y.Select(z => z.IgBan1Id).Min(), y.Select(z => z.IgBan3Id).Min(), y.Select(z => z.IgBan5Id).Min(), y.Select(z => z.IgBan7Id).Min(), y.Select(z => z.IgBan9Id).Min() },
                BansEnemyTeam = y.Where(z => z.TeamId == teamID).Select(s => s.IgTaskforce).Min() == 1 ?
                new List<int?> { y.Select(z => z.IgBan2Id).Min(), y.Select(z => z.IgBan4Id).Min(), y.Select(z => z.IgBan6Id).Min(), y.Select(z => z.IgBan8Id).Min(), y.Select(z => z.IgBan10Id).Min() } :
                new List<int?> { y.Select(z => z.IgBan1Id).Min(), y.Select(z => z.IgBan3Id).Min(), y.Select(z => z.IgBan5Id).Min(), y.Select(z => z.IgBan7Id).Min(), y.Select(z => z.IgBan9Id).Min() },
            }).ToListAsync();

            return teamMatchesStats;
        }
        private async Task<List<GodStatistics>> GetStatsPerGodByTeamIdFromDbAsync(int? teamID, List<TeamMatchesStats> teamMatchesStats)
        {
            List<GodStatistics> GodStatList = await _db.TableStats.Join(_db.TableGodDetails, stat => stat.GodPlayedId, god => god.GodId, (stat, god) => new
            {
                GodName = god.GodName,
                GodId = god.GodId,
                GodIconUrl = god.GodIconUrl,
                Stats = stat
            }).Where(x => x.Stats.TeamId == teamID).GroupBy(y => y.GodId, (y, z) => new GodStatistics
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
                AverageKda = z.Select(s => ((double)s.Stats.IgKills + (double)s.Stats.IgAssists) / (double)s.Stats.IgDeaths).Average(),
                AverageKills = z.Select(s => s.Stats.IgKills).Average(),
                AverageDeaths = z.Select(s => s.Stats.IgDeaths).Average(),
                AverageAssists = z.Select(s => s.Stats.IgAssists).Average(),
                AverageStructureDamage = z.Select(s => s.Stats.IgStructureDamage).Average(),
                AverageDamageDealt = z.Select(s => s.Stats.IgDamageDealt).Average(),
                AverageDamageMitigated = z.Select(s => s.Stats.IgDamageMitigated).Average(),
                AverageDamageTaken = z.Select(s => s.Stats.IgDamageTaken).Average(),
            }).ToListAsync();

            return GodStatList;
        }
        private async Task<TeamStatistics> GetTeamStatisticsByTeamIdAsync(int? teamID, List<TeamMatchesStats> teamMatchesStats)
        {
            TeamStatistics TeamStats = await _db.TableStats.Where(x => x.TeamId == teamID).GroupBy(y => y.TeamId, (y, z) => new TeamStatistics
            {
                GamesPlayed = z.Count() / 5, //divide by 5 because we get 5 rows of data per group
                Losses = z.Where(s => s.WinStatus == false).Count() / 5,
                Wins = z.Where(s => s.WinStatus == true).Count() / 5,
                TotalWardsPlaced = (int)z.Select(s => s.IgWardsPlaced).Sum(),
                TotalAssists = (int)z.Select(s => s.IgAssists).Sum(),
                TotalDamageDealt = (int)z.Select(s => s.IgDamageDealt).Sum(),
                TotalDamageTaken = (int)z.Select(s => s.IgDamageTaken).Sum(),
                TotalStructureDamage = (int)z.Select(s => s.IgStructureDamage).Sum(),
                TotalDamageMitigated = (int)z.Select(s => s.IgDamageMitigated).Sum(),
                TotalDeaths = (int)z.Select(s => s.IgDeaths).Sum(),
                TotalKills = (int)z.Select(s => s.IgKills).Sum(),
                TotalHealing = (int)z.Select(s => s.IgHealing).Sum(),
                
            }).FirstOrDefaultAsync();

            ////Games played, won, lost from matchresults to include forfeits.
            //TeamStats.GamesPlayed = await _db.TableMatchResults.Where(x => x.HomeTeamId == teamID || x.AwayTeamId == teamID).CountAsync();
            //TeamStats.Losses = await _db.TableMatchResults.Where(x => x.LosingTeamId == teamID).CountAsync();
            //TeamStats.Wins = await _db.TableMatchResults.Where(x => x.WinningTeamId == teamID).CountAsync();

            //Most banned against.
            List<int?> bannedGods = new List<int?>();
            //add all banned gods to 1 list
            teamMatchesStats.ForEach(x => bannedGods.AddRange(x.BansEnemyTeam));
            var top5BannedGods = bannedGods.GroupBy(r => r)
                .Select(grp => new
                {
                    Value = grp.Key,
                    Count = grp.Count()
                }).OrderByDescending(x => x.Count).Take(5);
            var godsFromDb = await _db.TableGodDetails.Where(x => top5BannedGods.Select(y => y.Value).ToList().Contains(x.GodId)).ToListAsync();
            if (godsFromDb?.Count() > 0)
            {
                TeamStats.MostBanned = godsFromDb.Join(top5BannedGods, godtable => godtable.GodId, top5 => top5.Value, (godtable, top5) => new { God = new God { GodId = godtable.GodId, GodName = godtable.GodName, GodIcon = godtable.GodIconUrl }, BanCount = top5.Count }).OrderByDescending(x => x.BanCount).Select(x => x.God).ToList();
            }

            return TeamStats;
        }
        private List<GodWithTimesPlayed> GetTop5MostPickedGods(List<GodStatistics> TeamGodStats)
        {
            List<GodWithTimesPlayed> mostPicked = TeamGodStats.OrderByDescending(x => x.TotalGamesPlayed).Take(5).Select(x => new GodWithTimesPlayed { GodName = x.God.GodName, GodId = x.God.GodId, GodIcon = x.God.GodIcon, TimesPlayed = x.TotalGamesPlayed }).ToList();

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
        private async Task<TeamMember> GetStarPlayerId(int? teamID, List<TeamMatchesStats> teamMatchesStats, List<TeamMember> currentTeamMembers)
        {
            List<PlayerStatistics> PlayerStats = await _db.TableStats.Where(x => x.TeamId == teamID).GroupBy(y => y.PlayerId, (y, z) => new PlayerStatistics
            {
                PlayerId = y,
                AverageKillParticipation = (int)Math.Round((double)(z.Select(s => s.IgKills).Sum() + (double)z.Select(s => s.IgAssists).Sum()) / (double)teamMatchesStats.Select(x => x.TotalKillsTeam).Sum() * 100),
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
            }).ToListAsync();

            List<MvpPlayer> mvpScores = new List<MvpPlayer>();
            foreach (var player in PlayerStats)
            {
                //calculate as double because of the 0.000 values then round up in the end to int
                int mvpScore = 0;
                mvpScore += (int)((player.TotalHealing) * 0.008);
                mvpScore += (int)((player.TotalDamageMitigated) * 0.006);
                mvpScore += (int)(player.TotalDamageDealt * 0.005);
                mvpScore += player.TotalKills * 20;
                mvpScore += player.TotalAssists * 15;
                mvpScore += player.TotalWardsPlaced * 9;
                mvpScore += (int)(player.TotalStructureDamage * 0.2);
                mvpScore += (int)(player.TotalGoldEarned * 0.1);
                mvpScore += (int)(((double)player.TotalStructureDamage) / 45);
                //if the player died divide score by number of deaths
                if (player.TotalDeaths > 0)
                {
                    mvpScore += mvpScore / player.TotalDeaths;
                }
                //kill participation calculation = (kills + assists) / total kills * 100
                //the sum returns the total amount of kills in this match
                //use double because division could go under 1 with 0.8 for example
                double totalKills = (int)teamMatchesStats.Select(x => x.TotalKillsTeam).Sum();
                double playerParticipation = player.TotalKills + player.TotalAssists;
                int killParticipationPercentage = Convert.ToInt32(playerParticipation / totalKills * 100);
                mvpScore += mvpScore * killParticipationPercentage;
                mvpScores.Add(new MvpPlayer { PlayerID = player?.PlayerId, MvpScore = mvpScore });
            }
            List<int?> currentMemberIds = new List<int?>();
            currentTeamMembers.ForEach(x => currentMemberIds.Add(x.PlayerID));
            int? MvpPlayerID = mvpScores.Where(x => currentMemberIds.Contains(x.PlayerID)).OrderByDescending(item => item.MvpScore).FirstOrDefault()?.PlayerID;


            return currentTeamMembers.Where(x => x.PlayerID == MvpPlayerID).FirstOrDefault();
        }
        private async Task<List<int>> GetRecentPerformanceScoreAsync(List<TeamMatchesStats> teamMatchesStats, int? teamID)
        {
            //get last matchups few matchups
            List<TableMatchResult> lastFewGames = await _db.TableMatchResults.Where(x => x.AwayTeamId == teamID || x.HomeTeamId == teamID).OrderByDescending(x => x.MatchResultId).Take(15).ToListAsync();

            List<int> recentPerformanceScoreList = new List<int>();

            //begin at the oldest of the last matchups
            foreach(var mr in lastFewGames.OrderBy(x => x.MatchResultId)) //order again so the recent score is in the right order
            {
                //get the specific match from that matchup
                var match = teamMatchesStats.Where(x => x.GameId == mr.GameId && x.MatchupId == mr.ScheduleMatchUpId).FirstOrDefault();

                if (match != null)
                {
                    double recentPerformanceScore = 0;
                    double matchTimeDivision = (double) (match.MatchDurationInSeconds != null ? match.MatchDurationInSeconds : 1) / 360;

                    recentPerformanceScore += (int)((double)match.TotalDamageDealtInMatch * 0.005);
                    recentPerformanceScore += (int)((double)match.GoldEarnedInMatch * 0.008);
                    recentPerformanceScore += (int)((double)match.TotalObjectivesTakenInMatch * 35);
                    recentPerformanceScore += (int)((double)match.TotalKillsTeam * 20);
                    recentPerformanceScore += (int)((double)match.TotalAssistsInMatch * 25);
                    //if the player died divide score by number of deaths
                    if (match.TotalDeathsInMatch > 0)
                    {
                        double DeathPenalty = (double)match.TotalDeathsInMatch * 10;
                        recentPerformanceScore = (int)(recentPerformanceScore - DeathPenalty);
                    }

                    recentPerformanceScore /= matchTimeDivision;

                    if (match.WonMatch == false)
                    {
                        recentPerformanceScore *= 0.9;
                    }

                    recentPerformanceScoreList.Add((int)recentPerformanceScore);
                }
                else
                {
                    //score for forfeit based on forfeit win or loss
                    recentPerformanceScoreList.Add(mr.WinningTeamId == teamID ? 500 : 0);
                }
            }

            return recentPerformanceScoreList;
        }
        private async Task<List<RecentMatch>> GetPageOfMatchupsByTeamId(int? teamID, int page)
        {
            //Actually played with stats
            //List<int?> IdOfLast5Matchups = teamMatchesStats.GroupBy(t => t.MatchupId, (x, y) => new { MatchupId = x, DatePlayed = y.Select(z => z.DatePlayed).Max() }).OrderByDescending(x => x.DatePlayed).Take(5).Select(x => x.MatchupId).ToList();

            //Last 5 based on results, includes forfeits
            var IdOfLast5Matchups = await _db.TableMatchResults.Where(tmr => tmr.AwayTeamId == teamID || tmr.HomeTeamId == teamID).GroupBy(t => t.ScheduleMatchUpId, (x, y) => new { ScheduleMatchUpId = x, DatePlayed = y.Select(z => z.DatePlayed).Max() }).OrderByDescending(x => x.DatePlayed).Skip(page * 5).Take(5).Select(x => x.ScheduleMatchUpId).ToListAsync();

            List<RecentMatch> matchHistoryList = await _db.TableMatchResults.Where(t => IdOfLast5Matchups.Contains(t.ScheduleMatchUpId)).GroupBy(x => x.ScheduleMatchUpId, (x, y) => new RecentMatch
            {
                MatchupID = x,
                GamesPlayed = y.Count(),
                Won = y.Count(i => i.WinningTeamId == teamID) == 2,
                Lost = y.Count(i => i.LosingTeamId == teamID) == 2,
                DatePlayed = y.Select(i => i.DatePlayed).Max().Value,
                Opponent = new Team { TeamID = y.Select(i => i.HomeTeamId).Max().Value != teamID ? y.Select(i => i.HomeTeamId).Max().Value : y.Select(i => i.AwayTeamId).Max().Value },
                MatchDurationInSeconds = y.Select(i => i.GamedurationInSeconds).Sum()
            }).OrderByDescending(x => x.DatePlayed).ToListAsync();

            List<int> listOfTeamIds = matchHistoryList.Select(x => x.Opponent.TeamID).Distinct().ToList();
            IEnumerable<Team> allTeamsInReturn = await _externalServices.GetBasicTeamInfoInBatchWithTeamIdsList(listOfTeamIds);
            //replace team entry with ID only with actual team
            if (allTeamsInReturn != null)
            {
                foreach (Team t in allTeamsInReturn)
                {
                    matchHistoryList.Where(mh => mh.Opponent.TeamID == t.TeamID).ToList().ForEach(r => r.Opponent = t);
                }
            }

            return matchHistoryList;
        }
        #endregion
    }
}
