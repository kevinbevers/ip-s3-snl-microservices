using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public async Task<ActionResult> GetMatchStatByGameIDAsync(int gameID)
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

        public async Task<ActionResult> ValidateAndSaveMatchStatsAsync(MatchData match)
        {
            try
            {
                List<int> IdsOfPlayerInMatchWinners = new List<int>();
                List<int> IdsOfPlayerInMatchLosers = new List<int>();
                //Add All player ids to 1 array of ints
                match.Winners.ForEach(p => IdsOfPlayerInMatchWinners.Add((int)p.player.PlayerID));
                match.Losers.ForEach(p => IdsOfPlayerInMatchLosers.Add((int)p.player.PlayerID));
                //Call team service to get the teams that where in this match.
                TeamWithDetails winnerTeam = await _externalServices.GetTeamByPlayersAsync(IdsOfPlayerInMatchWinners);
                TeamWithDetails loserTeam = await _externalServices.GetTeamByPlayersAsync(IdsOfPlayerInMatchLosers);

                //Send mail to one of captains and return message to the service that called this
                if (winnerTeam == null || loserTeam == null)
                {
                    await SendMailToTheCaptainsIfTeamIsNotNullAsync(match, winnerTeam, loserTeam);

                    return new ObjectResult("One of the teams in the match couldn't be found.") { StatusCode = 404 };
                }
                else
                {
                    #region Get email addresses for both captains
                    //Team captains email
                    int idWinner = winnerTeam.TeamMembers.Where(m => m.TeamCaptain == true).Select(m => m.TeamMemberID).FirstOrDefault();
                    string winnerCaptainMail = await _externalServices.GetCaptainEmailWithCaptainTeamMemberIDAsync(idWinner);
                    int idLoser = loserTeam.TeamMembers.Where(m => m.TeamCaptain == true).Select(m => m.TeamMemberID).FirstOrDefault();
                    string loserCaptainMail = await _externalServices.GetCaptainEmailWithCaptainTeamMemberIDAsync(idLoser);
                    #endregion

                    #region check if there is a ret_msg from the match. 
                    if (match.ret_msg != null)
                    {
                        string reason = match.ret_msg.ToString();
                        await SendErrorEmail(match, winnerTeam, loserTeam, winnerCaptainMail, loserCaptainMail, reason);

                        return new ObjectResult(match.ret_msg) { StatusCode = 400 }; //ex. Not all playerdata is available for this match because 1 of the players has their profile hidden.
                    }
                    #endregion

                    #region check if the played match is a conquest game with drafts
                    //check if the match is a custom conquest match.
                    if (match.GamemodeID != 429)
                    {
                        string reason = "The submitted match is not a custom conquest match with drafts";
                        await SendErrorEmail(match, winnerTeam, loserTeam, winnerCaptainMail, loserCaptainMail, reason);

                        return new ObjectResult("The submitted match is not a custom conquest match with drafts") { StatusCode = 400 };
                    }
                    #endregion

                    #region check if one of the teams is using more fills than allowed.
                    //Check for fills
                    bool winnerTeamUsedMoreFillsThanAllowed = checkForFillsAsync(winnerTeam, IdsOfPlayerInMatchWinners);
                    bool loserTeamUsedMoreFillsThanAllowed = checkForFillsAsync(loserTeam, IdsOfPlayerInMatchLosers);

                    if (winnerTeamUsedMoreFillsThanAllowed && loserTeamUsedMoreFillsThanAllowed)
                    {
                        await SendErrorEmail(match, winnerTeam, loserTeam, winnerCaptainMail, loserCaptainMail, $"Both teams used more fills then allowed, only 1 fill is allowed per team per match.");
                        return new ObjectResult("Both of the teams are using more fills then allowed, max 1 fill per team per match.") { StatusCode = 400 };
                    }
                    else if(winnerTeamUsedMoreFillsThanAllowed)
                    {
                        await SendErrorEmail(match, winnerTeam, loserTeam, winnerCaptainMail, loserCaptainMail, $"{winnerTeam.TeamName} used more fills then allowed, only 1 fill is allowed per team per match.");
                        return new ObjectResult($"{winnerTeam.TeamName} used more fills then allowed, max 1 fill per team per match.") { StatusCode = 400 };
                    }
                    else if(loserTeamUsedMoreFillsThanAllowed)
                    {
                        await SendErrorEmail(match,winnerTeam,loserTeam,winnerCaptainMail,loserCaptainMail, $"{loserTeam.TeamName} used more fills then allowed, only 1 fill is allowed per team per match.");
                        return new ObjectResult($"{loserTeam.TeamName} used more fills then allowed, max 1 fill per team per match.") { StatusCode = 400 };
                    }
                    #endregion

                    #region check if teams had a planned matchup recently
                    //Get current schedule that matches the teams in the match.
                    ScheduledMatch validMatchup = await ValidateMatchupAndGetMatchupAsync(winnerTeam, loserTeam, match);
                    Matchup m = validMatchup?.matchup;
                    //if there is no matchup found for the 2 teams
                    if (validMatchup == null)
                    {
                        await SendErrorEmail(match, winnerTeam, loserTeam, winnerCaptainMail, loserCaptainMail, $"There was no scheduled matchup found between these teams.");
                        return new ObjectResult("There was no scheduled matchup found between these teams.") { StatusCode = 404 };
                    }
                    else if(m == null)
                    {
                        await SendErrorEmail(match, winnerTeam, loserTeam, winnerCaptainMail, loserCaptainMail, $"There was no valid matchup found between these teams. <br /> A match can't be played before it's scheduled. <br /> Missed a match? you have 2 weeks max to catch up.");
                        return new ObjectResult("There was no valid matchup found between these teams.") { StatusCode = 404 };
                    }
                    #endregion

                    #region check if teams already played a game prior to this one or if this is the first for the matchup. and act upon it
                    List<TableMatchResult> previousMatchupResults = await _db.TableMatchResults.Where(mr => mr.ScheduleMatchUpId == m.MatchupID).ToListAsync();

                    //Add a new matchResult
                    TableMatchResult matchResultToAdd = new TableMatchResult
                    {
                        DatePlayed = match.EntryDate,
                        GameId = match.GameID,
                        ScheduleMatchUpId = m.MatchupID,
                        WinningTeamId = winnerTeam.TeamID,
                        LosingTeamId = loserTeam.TeamID
                    };

                    //Not the first gameID for this planned matchup
                    if (previousMatchupResults?.Count() > 0)
                    {
                        int homeTeamID = m.HomeTeam.TeamID;
                        int awayTeamID = m.AwayTeam.TeamID;
                        //Use the previousMatchResults to decide which game this is and if it needs to be added or the match was already decided.
                        int homeTeamWinCount = previousMatchupResults.Where(pm => pm.WinningTeamId == homeTeamID).Count();
                        int awayTeamWinCount = previousMatchupResults.Where(pm => pm.WinningTeamId == awayTeamID).Count();

                        //one of the teams already has 2 wins. in a best of 3 that means you already won the matchup
                        if(homeTeamWinCount > 1 || awayTeamWinCount > 1)
                        {
                            await SendErrorEmail(match, winnerTeam, loserTeam, winnerCaptainMail, loserCaptainMail, $"The submitted match was useless the matchup is already completed.");
                            return new ObjectResult("The submitted match was useless the matchup is already completed.") { StatusCode = 400 };
                        }
                        else
                        {
                            //save the matchResult to the matchresult table
                            _db.TableMatchResults.Add(matchResultToAdd);
                            await _db.SaveChangesAsync();

                            await UpdateScoreTextAsync(winnerTeam, m, homeTeamWinCount, awayTeamWinCount);
                            //update winCount based on latest result
                            homeTeamWinCount = winnerTeam.TeamID == homeTeamID ? homeTeamWinCount + 1 : homeTeamWinCount;
                            awayTeamWinCount = winnerTeam.TeamID == awayTeamID ? awayTeamWinCount + 1 : awayTeamWinCount;

                            //This game completed the matchup
                            if(homeTeamWinCount > 1 || awayTeamWinCount > 1)
                            {
                                await AddMatchResultsToStandingsAsync(winnerTeam, loserTeam, validMatchup, homeTeamID, awayTeamID, homeTeamWinCount, awayTeamWinCount);
                            }

                            await SaveMatchStatsToDatabaseAsync(match, winnerTeam, loserTeam, validMatchup);

                            //send email to both captains the match has been added
                            int gameNumber = homeTeamWinCount + awayTeamWinCount;
                            string gameDate = match.EntryDate.ToString("dddd dd MMMM yyyy 'at' H:mm");
                            string coolMailMessage = $"The match was played on {gameDate}. <br /> The match took {match.MatchDuration}.";
                            await SendSuccessMail(match, winnerTeam, loserTeam, winnerCaptainMail, loserCaptainMail, gameNumber, coolMailMessage);

                            return new ObjectResult("Match stats successfully saved") { StatusCode = 200 };
                        }
                    }
                    else //the first game of the matchup series
                    {
                        //save the matchResult to the matchresult table
                        _db.TableMatchResults.Add(matchResultToAdd);
                        await _db.SaveChangesAsync();

                        await UpdateScoreTextAsync(winnerTeam, m, 0, 0);

                        await SaveMatchStatsToDatabaseAsync(match, winnerTeam, loserTeam, validMatchup);

                        //send email to both captains the match has been added
                        int gameNumber = 1;
                        string gameDate = match.EntryDate.ToString("dddd dd MMMM yyyy 'at' H:mm");
                        string coolMailMessage = $"The match was played on {gameDate}. <br /> The match took {match.MatchDuration}.";
                        await SendSuccessMail(match, winnerTeam, loserTeam, winnerCaptainMail, loserCaptainMail, gameNumber, coolMailMessage);

                        return new ObjectResult("Match stats successfully saved") { StatusCode = 200 };

                    }
                    #endregion
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to Save Match stats.");
                //return result to client
                return new ObjectResult("Something went wrong trying to Save Match stats.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        #region methods
        private async Task SaveMatchStatsToDatabaseAsync(MatchData match, TeamWithDetails winnerTeam, TeamWithDetails loserTeam, ScheduledMatch validMatchup)
        {
            List<TableStat> matchStatsPerPlayer = new List<TableStat>();

            //create stat entries for each winner
            matchStatsPerPlayer.AddRange(ConvertMatchDataToTableStat(match, match.Winners, winnerTeam, validMatchup));
            //create stat entries for each loser
            matchStatsPerPlayer.AddRange(ConvertMatchDataToTableStat(match, match.Losers, loserTeam, validMatchup));

            //save new stat entries to the database
            await _db.TableStats.AddRangeAsync(matchStatsPerPlayer);
            await _db.SaveChangesAsync();

            #region add gods and items if needed
            //Add god and item data to database if not present yet.
            List<God> allGodsInTheMatch = new List<God>();
            //get all gods that where in the losing team
            allGodsInTheMatch.AddRange(match.Losers.Select(p => p.God).ToList());
            //get all the gods that where in the winning team
            allGodsInTheMatch.AddRange(match.Winners.Select(p => p.God).ToList());
            //add all banned gods to the list
            allGodsInTheMatch.AddRange(match.BannedGods);

            List<TableGodDetail> godsToAdd = new List<TableGodDetail>();

            foreach (var god in allGodsInTheMatch)
            {
                //make sure the god contains the data we need
                if (god.GodId != null && god.GodId != 0 && god.GodIcon != null && god.GodName != null)
                {
                    //if the god isn't in the database, add
                    if (await _db.TableGodDetails.Where(g => g.GodId == god.GodId).CountAsync() == 0)
                    {
                        if (godsToAdd.Where(g => g.GodId == (int)god.GodId).Count() == 0)
                        {
                            godsToAdd.Add(new TableGodDetail
                            {
                                GodId = (int)god.GodId,
                                GodIconUrl = god.GodIcon,
                                GodName = god.GodName
                            });
                        }
                    }
                }
            }

            List<Item> allItemsInTheMatch = new List<Item>();
            //get all gods that where in the losing team
           match.Winners.ForEach(i => {
               allItemsInTheMatch.Add(new Item { ItemID = i.Relic1ID, ItemName = i.Relic1Name, ItemIcon = i.Relic1Icon });
               allItemsInTheMatch.Add(new Item { ItemID = i.Relic2ID, ItemName = i.Relic2Name, ItemIcon = i.Relic2Icon });
                allItemsInTheMatch.Add(new Item { ItemID = i.Item1ID, ItemName = i.Item1Name, ItemIcon = i.Item1Icon });
                allItemsInTheMatch.Add(new Item { ItemID = i.Item2ID, ItemName = i.Item2Name, ItemIcon = i.Item2Icon });
                allItemsInTheMatch.Add(new Item { ItemID = i.Item3ID, ItemName = i.Item3Name, ItemIcon = i.Item3Icon });
                allItemsInTheMatch.Add(new Item { ItemID = i.Item4ID, ItemName = i.Item4Name, ItemIcon = i.Item4Icon });
                allItemsInTheMatch.Add(new Item { ItemID = i.Item5ID, ItemName = i.Item5Name, ItemIcon = i.Item5Icon });
                allItemsInTheMatch.Add(new Item { ItemID = i.Item6ID, ItemName = i.Item6Name, ItemIcon = i.Item6Icon });
            });

            match.Losers.ForEach(i => {
                allItemsInTheMatch.Add(new Item { ItemID = i.Relic1ID, ItemName = i.Relic1Name, ItemIcon = i.Relic1Icon });
                allItemsInTheMatch.Add(new Item { ItemID = i.Relic2ID, ItemName = i.Relic2Name, ItemIcon = i.Relic2Icon });
                allItemsInTheMatch.Add(new Item { ItemID = i.Item1ID, ItemName = i.Item1Name, ItemIcon = i.Item1Icon });
                allItemsInTheMatch.Add(new Item { ItemID = i.Item2ID, ItemName = i.Item2Name, ItemIcon = i.Item2Icon });
                allItemsInTheMatch.Add(new Item { ItemID = i.Item3ID, ItemName = i.Item3Name, ItemIcon = i.Item3Icon });
                allItemsInTheMatch.Add(new Item { ItemID = i.Item4ID, ItemName = i.Item4Name, ItemIcon = i.Item4Icon });
                allItemsInTheMatch.Add(new Item { ItemID = i.Item5ID, ItemName = i.Item5Name, ItemIcon = i.Item5Icon });
                allItemsInTheMatch.Add(new Item { ItemID = i.Item6ID, ItemName = i.Item6Name, ItemIcon = i.Item6Icon });
            });

            List<TableItemDetail> itemsToAdd = new List<TableItemDetail>();

            foreach (var item in allItemsInTheMatch)
            {
                if (item.ItemID != null && item.ItemID != 0 && item.ItemName != null && item.ItemIcon != null)
                {
                    //if the god isn't in the database, add
                    if (await _db.TableItemDetails.Where(i => i.ItemId == item.ItemID).CountAsync() == 0)
                    {
                        if (itemsToAdd.Where(i => i.ItemId == (int)item.ItemID).Count() == 0)
                        {
                            itemsToAdd.Add(new TableItemDetail
                            {
                                ItemId = (int)item.ItemID,
                                ItemName = item.ItemName,
                                ItemIconUrl = item.ItemIcon,
                            });
                        }
                    }
                }
            }
            //add the new items to the database
            await _db.TableGodDetails.AddRangeAsync(godsToAdd);
            await _db.TableItemDetails.AddRangeAsync(itemsToAdd);
            //save changes godtable and itemtable to database
            await _db.SaveChangesAsync();
            #endregion

        }

        private IList<TableStat> ConvertMatchDataToTableStat(MatchData match, List<MatchData.PlayerStat> players, TeamWithDetails snlTeam, ScheduledMatch validMatchup)
        {
            List<TableStat> convertedStats = new List<TableStat>();

            foreach (var p in players)
            {
                TableStat stat = new TableStat
                {
                    GameId = match.GameID,
                    MatchPlayedDate = match.EntryDate,
                    IgMatchLengthInSeconds = match.MatchDurationInSeconds,
                    MatchupId = validMatchup.matchup.MatchupID,
                    DivisionId = snlTeam.DivisionID,
                    ScheduleId = validMatchup.ScheduleID,
                    TeamId = snlTeam.TeamID,
                    PlayerIsFill = snlTeam.TeamMembers?.Where(tm => tm.PlayerID == p.player.PlayerID).Count() <= 0,
                    WinStatus = p.Won,
                    RoleId = snlTeam.TeamMembers?.Where(tm => tm.PlayerID == p.player.PlayerID).Select(tm => tm.TeamMemberRole.RoleID).FirstOrDefault(),
                    PlayerId = p.player.PlayerID,
                    PatchNumber = match.patchNumber,
                    IgTaskforce = p.IngameTeamID,
                    GodPlayedId = p.God.GodId,
                    IgGodName = p.God.GodName,
                    IgPlayerLevel = p.Level?.ToString(),
                    IgDamageDealt = p.DamageDealt,
                    IgDamageMitigated = p.DamageMitigated,
                    IgDamageTaken = p.DamageTaken,
                    IgFireGiantsKilled = p.FireGiantsKilled,
                    IgGoldFuriesKilled = p.GoldFuriesKilled,
                    IgObjectiveAssists = p.ObjectiveAssists,
                    IgStructureDamage = p.StructureDamage,
                    IgMinionDamage = p.MinionDamage,
                    IgTowersDestroyed = p.TowersDestroyed,
                    IgPhoenixesDestroyed = p.PhoenixesDestroyed,
                    IgFirstBlood = p.FirstBlood,
                    IgHighestMultiKill = p.HighestMultiKill,
                    IgDoubles = p.Doubles,
                    IgTriples = p.Triples,
                    IgQuadras = p.Quadras,
                    IgPentas = p.Pentas,
                    IgTimeSpentDeathInSeconds = p.TimeSpentDeathInSeconds,
                    IgWardsPlaced = p.WardsPlaced,
                    IgRegion = p.Region,
                    IgDistanceTraveled = p.DistanceTravelled,
                    IgKills = p.Kills,
                    IgAssists = p.Assists,
                    IgDeaths = p.Deaths,
                    IgGoldEarned = p.GoldEarned,
                    IgGpm = p.GPM,
                    IgHealing = p.Healing,
                    IgRelic1Id = p.Relic1ID,
                    IgRelic2Id = p.Relic2ID,
                    IgItem1Id = p.Item1ID,
                    IgItem2Id = p.Item2ID,
                    IgItem3Id = p.Item3ID,
                    IgItem4Id = p.Item4ID,
                    IgItem5Id = p.Item5ID,
                    IgItem6Id = p.Item6ID,
                    IgBan1Id = match.BannedGods[0].GodId,
                    IgBan2Id = match.BannedGods[1].GodId,
                    IgBan3Id = match.BannedGods[2].GodId,
                    IgBan4Id = match.BannedGods[3].GodId,
                    IgBan5Id = match.BannedGods[4].GodId,
                    IgBan6Id = match.BannedGods[5].GodId,
                    IgBan7Id = match.BannedGods[6].GodId,
                    IgBan8Id = match.BannedGods[7].GodId,
                    IgBan9Id = match.BannedGods[8].GodId,
                    IgBan10Id = match.BannedGods[9].GodId,
                    
                };

                convertedStats.Add(stat);
            }

            return convertedStats;
        }

        private async Task AddMatchResultsToStandingsAsync(TeamWithDetails winnerTeam, TeamWithDetails loserTeam, ScheduledMatch validMatchup, int homeTeamID, int awayTeamID, int homeTeamWinCount, int awayTeamWinCount)
        {
            //check if there is a standing for the teams
            TableStanding homeTeamStanding = await _db.TableStandings.Where(ts => ts.ScheduleId == validMatchup.ScheduleID && ts.TeamId == homeTeamID).FirstOrDefaultAsync();
            TableStanding awayTeamStanding = await _db.TableStandings.Where(ts => ts.ScheduleId == validMatchup.ScheduleID && ts.TeamId == awayTeamID).FirstOrDefaultAsync();

            if (homeTeamWinCount > awayTeamWinCount)
            {
                //Add or update standings
                if (homeTeamStanding == null)
                {
                    TableStanding newHomeTeamStanding = new TableStanding
                    {
                        DivisionId = winnerTeam.DivisionID,
                        ScheduleId = validMatchup.ScheduleID,
                        TeamId = winnerTeam.TeamID,
                        StandingLosses = 0,
                        StandingWins = 1,
                        StandingScore = awayTeamWinCount == 0 ? 3 : 2
                    };

                    _db.TableStandings.Add(newHomeTeamStanding);
                }
                else
                {
                    //add 1 win to the win column
                    homeTeamStanding.StandingWins += 1;
                    //if the team won 2 games against 0 they should get 3 points. otherwise they should get only 2
                    homeTeamStanding.StandingScore = awayTeamWinCount == 0 ? +3 : +2;

                    _db.TableStandings.Update(homeTeamStanding);
                }

                if (awayTeamStanding == null)
                {
                    TableStanding newAwayTeamStanding = new TableStanding
                    {
                        DivisionId = loserTeam.DivisionID,
                        ScheduleId = validMatchup.ScheduleID,
                        TeamId = loserTeam.TeamID,
                        StandingLosses = 1,
                        StandingWins = 0,
                        StandingScore = awayTeamWinCount == 1 ? 1 : 0
                    };

                    _db.TableStandings.Add(newAwayTeamStanding);
                }
                else
                {
                    //add 1 loss to the loss column
                    awayTeamStanding.StandingLosses += 1;
                    //if the team won atleast a match give them a point.
                    awayTeamStanding.StandingScore = awayTeamWinCount == 1 ? +1 : +0;

                    _db.TableStandings.Update(awayTeamStanding);
                }

                await _db.SaveChangesAsync();
            }
            else
            {
                //awayteam won the matchup
                //Add or update standings
                if (awayTeamStanding == null)
                {
                    TableStanding newAwayTeamStanding = new TableStanding
                    {
                        DivisionId = winnerTeam.DivisionID,
                        ScheduleId = validMatchup.ScheduleID,
                        TeamId = winnerTeam.TeamID,
                        StandingLosses = 0,
                        StandingWins = 1,
                        StandingScore = homeTeamWinCount == 0 ? 3 : 2
                    };

                    _db.TableStandings.Add(newAwayTeamStanding);
                }
                else
                {
                    //add 1 win to the win column
                    awayTeamStanding.StandingWins += 1;
                    //if the team won 2 games against 0 they should get 3 points. otherwise they should get only 2
                    awayTeamStanding.StandingScore = homeTeamWinCount == 0 ? +3 : +2;

                    _db.TableStandings.Update(awayTeamStanding);
                }

                if (homeTeamStanding == null)
                {
                    TableStanding newHomeTeamStanding = new TableStanding
                    {
                        DivisionId = loserTeam.DivisionID,
                        ScheduleId = validMatchup.ScheduleID,
                        TeamId = loserTeam.TeamID,
                        StandingLosses = 1,
                        StandingWins = 0,
                        StandingScore = homeTeamWinCount == 1 ? 1 : 0
                    };

                    _db.TableStandings.Add(newHomeTeamStanding);
                }
                else
                {
                    //add 1 loss to the loss column
                    homeTeamStanding.StandingLosses += 1;
                    //if the team won atleast a match give them a point.
                    homeTeamStanding.StandingScore = homeTeamWinCount == 1 ? +1 : +0;

                    _db.TableStandings.Update(homeTeamStanding);
                }

                await _db.SaveChangesAsync();
            }
        }

        private async Task UpdateScoreTextAsync(TeamWithDetails winnerTeam, Matchup m, int homeTeamScore, int awayTeamScore)
        {
            if (m.HomeTeam.TeamID == winnerTeam.TeamID)
            {
                //home team won
                await _externalServices.UpdateScoreInScheduleAsync($"{homeTeamScore + 1} - {awayTeamScore}", m.MatchupID);
            }
            else
            {
                //away team won
                await _externalServices.UpdateScoreInScheduleAsync($"{homeTeamScore} - {awayTeamScore + 1}", m.MatchupID);
            }
        }

        private async Task<ScheduledMatch> ValidateMatchupAndGetMatchupAsync(TeamWithDetails winnerTeam, TeamWithDetails loserTeam, MatchData match)
        {
            //return null, matchup is auto invalid if teams are not in the same division
            if (winnerTeam.DivisionID != loserTeam.DivisionID)
            {
                return null;
            }

            Schedule foundSchedule = await _externalServices.GetPlannedMatchUpByDivisionIdAsync((int)winnerTeam.DivisionID);

            //if foundschedule is empty there is no schedule found and the match is found invalid
            if (foundSchedule != null)
            {
                ScheduledMatch scheduledMatch = new ScheduledMatch { ScheduleID = foundSchedule.ScheduleID };
                //Get the 2 matchups that are scheduled for these 2 teams
                Matchup matchup1 = foundSchedule.Matchups.Where(mup => mup.HomeTeam.TeamID == winnerTeam.TeamID && mup.AwayTeam.TeamID == loserTeam.TeamID).FirstOrDefault();
                Matchup matchup2 = foundSchedule.Matchups.Where(mup => mup.HomeTeam.TeamID == winnerTeam.TeamID && mup.AwayTeam.TeamID == loserTeam.TeamID).FirstOrDefault();
                List<Matchup> matchups = new List<Matchup> { matchup1, matchup2 };
                //Get the matchup that is already past the currentWeek / the same and check if the matchup is not older then 2 weeks. 2 weeks is the catchup time.
                scheduledMatch.matchup = matchups.Where(mup => mup.WeekNumber <= foundSchedule.CurrentWeek && Math.Abs(mup.WeekNumber - foundSchedule.CurrentWeek) <= 2).FirstOrDefault();

                return scheduledMatch;
            }
            else
            {
                return null;
            }
        }

        private bool checkForFillsAsync(TeamWithDetails teamToCheck, List<int> playersInMatch)
        {
            int originalTeamCount = teamToCheck.TeamMembers.Where(tm => playersInMatch.Contains(tm.PlayerID)).Count();
            if (originalTeamCount < 4)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        private async Task SendMailToTheCaptainsIfTeamIsNotNullAsync(MatchData match, TeamWithDetails winnerTeam, TeamWithDetails loserTeam)
        {
            string title = "Match was not accepted";
            string message = $"<b>Submitted Match ID:</b> {match.GameID} <br /><br /> <b>Reason:</b><br /> One of the teams in the match couldn't be found in our system. <br /><br /> Disagree with the verdict? reply to this email explaining why you think the verdict is incorrect.";

            if (winnerTeam != null)
            {
                //one of the teams in the match was not found. this means the submitted match is invalid.
                int id = winnerTeam.TeamMembers.Where(m => m.TeamCaptain == true).Select(m => m.TeamMemberID).FirstOrDefault();
                string captainmail = await _externalServices.GetCaptainEmailWithCaptainTeamMemberIDAsync(id);
                if (captainmail != null || captainmail != "")
                {
                    await _externalServices.SendEmailNotificationToCaptainAsync(message, title, captainmail);
                }
            }

            if (loserTeam != null)
            {
                //one of the teams in the match was not found. this means the submitted match is invalid.
                int id = loserTeam.TeamMembers.Where(m => m.TeamCaptain == true).Select(m => m.TeamMemberID).FirstOrDefault();
                string captainmail = await _externalServices.GetCaptainEmailWithCaptainTeamMemberIDAsync(id);

                if (captainmail != null || captainmail != "")
                {
                    await _externalServices.SendEmailNotificationToCaptainAsync(message, title, captainmail);
                }
            }
        }

        private async Task SendErrorEmail(MatchData match, TeamWithDetails winnerTeam, TeamWithDetails loserTeam, string winnerCaptainMail, string loserCaptainMail, string reason)
        {
            string title = "Match was not accepted";
            string messageWinner = $"<b>Submitted Match ID:</b> {match.GameID} <br /><br /><b>Opponent:</b> {loserTeam.TeamName} <br /><br /> <b>Reason:</b><br />{reason} <br /><br /> Disagree with the verdict? reply to this email explaining why you think the verdict is incorrect.";
            string messageLoser = $"<b>Submitted Match ID:</b> {match.GameID} <br /><br /><b>Opponent:</b> {winnerTeam.TeamName} <br /><br /> <b>Reason:</b><br />{reason} <br /><br /> Disagree with the verdict? reply to this email explaining why you think the verdict is incorrect.";

            await _externalServices.SendEmailNotificationToCaptainAsync(messageWinner, title, winnerCaptainMail);
            await _externalServices.SendEmailNotificationToCaptainAsync(messageLoser, title, loserCaptainMail);
        }

        private async Task SendSuccessMail(MatchData match, TeamWithDetails winnerTeam, TeamWithDetails loserTeam, string winnerCaptainMail, string loserCaptainMail, int gameNumber, string msg)
        {
            string title = "Match submitted successfully";
            string messageWinner = $"<b>Submitted Match ID:</b> {match.GameID} <br /><b>Game:</b> {gameNumber} <br /> <b>Opponent:</b> {loserTeam.TeamName} <br /><br /> {msg} <br />";
            string messageLoser = $"<b>Submitted Match ID:</b> {match.GameID} <br /><b>Game:</b> {gameNumber} <br /> <b>Opponent:</b> {winnerTeam.TeamName} <br /><br /> {msg} <br />";

            await _externalServices.SendEmailNotificationToCaptainAsync(messageWinner, title, winnerCaptainMail);
            await _externalServices.SendEmailNotificationToCaptainAsync(messageLoser, title, loserCaptainMail);
        }

        #endregion
    }
}
