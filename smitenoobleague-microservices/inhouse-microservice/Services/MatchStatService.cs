using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using inhouse_microservice.Interfaces;
using inhouse_microservice.Models.External;
using inhouse_microservice.Models.Internal;
using inhouse_microservice.Inhouse_DB;

namespace inhouse_microservice.Services
{
    public class MatchStatService : IMatchStatService
    {
        private readonly SNL_Inhouse_DBContext  _db;
        private readonly ILogger<MatchStatService> _logger;

        public MatchStatService(SNL_Inhouse_DBContext db, ILogger<MatchStatService> logger)
        {
            _db = db;
            _logger = logger;

        }

        public async Task<ActionResult<MatchHistoryDetails>> GetInhouseMatchHistoryByGameIdAsync(int gameId)
        {
            try
            {
                MatchHistoryDetails matchHistoryDetails = new MatchHistoryDetails {
                    GameID = gameId
                };

                List<TableStat> matchStats = await _db.TableStats.Where(ts => ts.GameId == gameId).ToListAsync();

                if(matchStats?.Count() > 0)
                {
                    if (matchStats?.Count() > 0)
                    {
                        TimeSpan time = TimeSpan.FromSeconds((int)matchStats?[0]?.IgMatchLengthInSeconds);
                        var ms = matchStats?[0];

                        MatchDataWithExtras matchData = new MatchDataWithExtras
                        {
                            GameID = matchStats?[0]?.GameId,
                            EntryDate = (DateTime)matchStats?[0]?.MatchPlayedDate,
                            MatchDurationInSeconds = matchStats?[0]?.IgMatchLengthInSeconds,
                            patchNumber = matchStats?[0]?.PatchNumber,
                            BannedGods = new List<God>(),
                            Winners = new List<PlayerStat>(),
                            Losers = new List<PlayerStat>(),
                            MatchDuration = $"{time.TotalMinutes:0} min {time:ss} sec",
                            WinningTeamID = ms.IgTaskforce == 1 && ms.WinStatus == true ? 1 : 2,
                            LosingTeamID = ms.IgTaskforce == 1 && ms.WinStatus == false ? 1 : 2
                        };

                       


                        List<MvpPlayer> mvpScores = new List<MvpPlayer>();
                        List<int?> itemsInMatch = new List<int?>();
                        //All gods played in the match
                        List<int?> godsInMatch = new List<int?>();
                        //for each stat row in the match get the ids needed and calculate mvp score
                        foreach (var player in matchStats)
                        {
                            //calculate as double because of the 0.000 values then round up in the end to int
                            int mvpScore = 0;
                            mvpScore += (int)(((double)player.IgHealing) * 0.008);
                            mvpScore += (int)(((double)player.IgDamageMitigated) * 0.006);
                            mvpScore += (int)(((double)player.IgDamageDealt) * 0.005);
                            mvpScore += (int)player.IgKills * 20;
                            mvpScore += (int)player.IgAssists * 15;
                            mvpScore += (int)player.IgWardsPlaced * 9;
                            mvpScore += (int)(((double)player.IgStructureDamage) * 0.2);
                            mvpScore += (int)(((double)player.IgGoldEarned) * 0.1);
                            mvpScore += (int)(((double)player.IgStructureDamage) / 45);
                            //if the player died divide score by number of deaths
                            if (player.IgDeaths > 0)
                            {
                                mvpScore /= (int)player.IgDeaths;
                            }
                            //kill participation calculation = (kills + assists) / total kills * 100
                            //the sum returns the total amount of kills in this match
                            //use double because division could go under 1 with 0.8 for example
                            double totalKills = (int)matchStats.Select(m => m.IgKills).Sum();
                            double playerParticipation = (int)player.IgKills + (int)player.IgAssists;
                            int killParticipationPercentage = Convert.ToInt32(playerParticipation / totalKills * 100);
                            mvpScore *= (int)killParticipationPercentage;
                            if (player?.PlayerId == null)
                            {
                                //think of something to give hidden players mvp
                            }
                            else
                            {
                                mvpScores.Add(new MvpPlayer { PlayerID = (int)player?.PlayerId, MvpScore = mvpScore });
                            }

                            //add all items to the list
                            itemsInMatch.Add(player?.IgItem1Id);
                            itemsInMatch.Add(player?.IgItem2Id);
                            itemsInMatch.Add(player?.IgItem3Id);
                            itemsInMatch.Add(player?.IgItem4Id);
                            itemsInMatch.Add(player?.IgItem5Id);
                            itemsInMatch.Add(player?.IgItem6Id);
                            itemsInMatch.Add(player?.IgRelic1Id);
                            itemsInMatch.Add(player?.IgRelic2Id);
                            //add played god to the list
                            godsInMatch.Add(player?.GodPlayedId);
                        }
                        //Set the mvp in the return value
                        matchData.MvpPlayerID = mvpScores.OrderByDescending(item => item.MvpScore).First().PlayerID;
                        //All banned gods in the match
                        List<int?> bansIds = new List<int?> { ms.IgBan1Id, ms.IgBan2Id, ms.IgBan3Id, ms.IgBan4Id, ms.IgBan5Id, ms.IgBan6Id, ms.IgBan7Id, ms.IgBan8Id, ms.IgBan9Id, ms.IgBan10Id };
                        //Get all gods that where played or banned from the database
                        List<TableGodDetail> allGods = await _db.TableGodDetails.Where(tg => bansIds.Contains(tg.GodId) || godsInMatch.Contains(tg.GodId)).ToListAsync();
                        List<TableItemDetail> allItems = await _db.TableItemDetails.Where(ti => itemsInMatch.Contains(ti.ItemId)).ToListAsync();

                        for (int i = 0; i < 10; i++)
                        {
                            if (bansIds[i] != null && bansIds[i] != 0)
                            {
                                TableGodDetail god = allGods.Where(bg => bg.GodId == bansIds[i]).FirstOrDefault();

                                God ban = new God
                                {
                                    GodId = bansIds[i],
                                    GodName = god.GodName,
                                    GodIcon = god.GodIconUrl
                                };
                                //add to list of bans
                                matchData.BannedGods.Add(ban);
                            }
                            else
                            {
                                //passed ban
                                God ban = new God
                                {
                                    GodId = bansIds[i],
                                    GodIcon = null,
                                };
                                matchData.BannedGods.Add(ban);
                            }
                        }

                        matchData.Winners = CreateListOfPlayerStatsByWinStatus(matchStats, allGods, allItems, true);
                        matchData.Losers = CreateListOfPlayerStatsByWinStatus(matchStats, allGods, allItems, false);

                        matchHistoryDetails.MatchResult = matchData;
                    }
                    else
                    {
                        matchHistoryDetails.MatchResult = null;
                    }

                    return new ObjectResult(matchHistoryDetails) { StatusCode = 200 };
                }
                else
                {
                    return new ObjectResult("No matchhistory found for the given gameID") { StatusCode = 404 };
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to Get inhouse matchdetails with gameID.");
                //return result to client
                return new ObjectResult("Something went wrong trying to Get inhouse matchdetails with gameID.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult<IEnumerable<MatchHistory>>> GetInhouseMatchHistoryOverview(int pageSize, int pageIndex)
        {
            try
            {
                //would of liked it to be more compact but entity framework left me no choice, can't orderby and group by and then skip and take in the same query
                //get the latest matchup id's
                var listOfMatchups = await _db.TableStats.Select(t => new { t.MatchPlayedDate, t.GameId }).Distinct().OrderByDescending(t => t.MatchPlayedDate).Skip(pageSize * pageIndex).Take(pageSize).Select(x => x.GameId).ToListAsync();
                //get all the entries for each matchup Id and calculate the totals
                List<MatchHistory> matchHistoryList = await _db.TableStats.Where(t => listOfMatchups.Contains(t.GameId)).GroupBy(x => x.GameId, (x, y) => new MatchHistory
                {
                    GameID = x,
                    DatePlayed = y.Select(i => i.MatchPlayedDate).Max().Value,
                    TotalMatchDuration = string.Format("{1:0} min {0:ss} sec", TimeSpan.FromSeconds((int)y.Select(i => i.IgMatchLengthInSeconds).Min()), TimeSpan.FromSeconds((int)y.Select(i => i.IgMatchLengthInSeconds).Min()).TotalMinutes),
                    homeWin = (bool)y.Where(i => i.IgTaskforce == 1).Select(i => i.WinStatus).Min()
                }).ToListAsync();


                foreach (var match in matchHistoryList)
                {
                    match.ChaosPlayers = await _db.TableStats.Where(x => x.GameId == match.GameID && x.IgTaskforce == 2).Select(x => new Player { PlayerID = x.PlayerId, Playername = x.PlayerName, Platform = ((ApiPlatformEnum)x.PlayerPlatformId).ToString() }).ToListAsync();
                    match.OrderPlayers = await _db.TableStats.Where(x => x.GameId == match.GameID && x.IgTaskforce == 1).Select(x => new Player { PlayerID = x.PlayerId, Playername = x.PlayerName, Platform = ((ApiPlatformEnum)x.PlayerPlatformId).ToString() }).ToListAsync();
                }

                return new ObjectResult(matchHistoryList.OrderByDescending(l => l.DatePlayed)) { StatusCode = 200 };
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to get list of inhouse matchhistory.");
                //return result to client
                return new ObjectResult("Something went wrong trying to get list of inhouse matchhistory.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> ValidateAndSaveInhouseMatchStatsAsync(MatchData match)
        {
            try
            {
                    #region check if there is a ret_msg from the match. 
                    if (match.ret_msg != null)
                    {
                        return new ObjectResult(match.ret_msg) { StatusCode = 400 }; //ex. Not all playerdata is available for this match because 1 of the players has their profile hidden.
                    }
                    #endregion

                    #region check if the played match is a conquest game with drafts
                    //check if the match is a custom conquest match.
                    if (match.GamemodeID != 429)
                    {
                        return new ObjectResult("The submitted match is not a custom conquest match with drafts") { StatusCode = 400 };
                    }
                    #endregion

                    #region save the matchdata
                        await SaveMatchStatsToDatabaseAsync(match);
                        return new ObjectResult("Match stats successfully saved") { StatusCode = 200 };
                    #endregion
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to Save Match stats.");
                //return result to client
                return new ObjectResult("Something went wrong trying to Save Match stats.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        public async Task<ActionResult> DeleteInhouseMatchDataByGameIdAsync(int gameId)
        {
            try
            {
                List<TableStat> foundMatchStats = await _db.TableStats.Where(t => t.GameId == gameId).ToListAsync();
                if (foundMatchStats?.Count > 0)
                {
                    _db.TableStats.RemoveRange(foundMatchStats);
                    await _db.SaveChangesAsync();

                    return new ObjectResult("match stats deleted successfully.") { StatusCode = 200 }; //OK
                }
                else
                {
                    return new ObjectResult("No match stats found with the given gameID.") { StatusCode = 404 }; //NOT FOUND
                }

            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to delete a match.");
                //return result to client
                return new ObjectResult("Something went wrong trying to delete a match.") { StatusCode = 500 }; //INTERNAL SERVER ERROR
            }
        }

        #region methods
        private async Task SaveMatchStatsToDatabaseAsync(MatchData match)
    {
        List<TableStat> matchStatsPerPlayer = new List<TableStat>();

        //create stat entries for each winner
        matchStatsPerPlayer.AddRange(ConvertMatchDataToTableStat(match, match.Winners));
        //create stat entries for each loser
        matchStatsPerPlayer.AddRange(ConvertMatchDataToTableStat(match, match.Losers));

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

    private IList<TableStat> ConvertMatchDataToTableStat(MatchData match, List<PlayerStat> players)
            {
                List<TableStat> convertedStats = new List<TableStat>();

                foreach (var p in players)
                {
                    TableStat stat = new TableStat
                    {
                        GameId = match.GameID,
                        MatchPlayedDate = match.EntryDate,
                        IgMatchLengthInSeconds = match.MatchDurationInSeconds,
                        WinStatus = p.Won,
                        PlayerId = p?.Player?.PlayerID == 0 ? null : p?.Player?.PlayerID,
                        PlayerName = p?.Player?.Playername,
                        PlayerPlatformId = p?.Player?.Platform != "" ? (int?)(ApiPlatformEnum)Enum.Parse(typeof(ApiPlatformEnum), p?.Player?.Platform) : null,
                        PatchNumber = match.patchNumber,
                        IgTaskforce = p.IngameTeamID,
                        GodPlayedId = p.God.GodId,
                        IgGodName = p.God.GodName,
                        IgPlayerLevel = p.Level,
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
                        IgKillingSpree = p.KillingSpree,
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
                        TotalKillsTeam = p.Won ? match.Winners.Select(x => x.Kills).Sum() : match.Losers.Select(x => x.Kills).Sum() //save total kills
                    };

                    convertedStats.Add(stat);
                }

                return convertedStats;
            }

    private List<PlayerStat> CreateListOfPlayerStatsByWinStatus(List<TableStat> matchStats, List<TableGodDetail> allGods, List<TableItemDetail> allItems, bool won)
            {
                List<PlayerStat> listOfPlayerStats = new List<PlayerStat>();

                //Foreach player with given winstatus
                foreach (var p in matchStats.Where(ms => ms.WinStatus == won))
                {
                    //Get the played god data from the database
                    TableGodDetail god = allGods.Where(g => g.GodId == p.GodPlayedId).FirstOrDefault();

                    God playedGod = new God
                    {
                        GodId = p.GodPlayedId,
                        GodName = god.GodName,
                        GodIcon = god.GodIconUrl
                    };

                    //Get all 6 items and the 2 relics from the DB
                    TableItemDetail item1 = allItems.Where(i => i.ItemId == p.IgItem1Id).FirstOrDefault();
                    TableItemDetail item2 = allItems.Where(i => i.ItemId == p.IgItem2Id).FirstOrDefault();
                    TableItemDetail item3 = allItems.Where(i => i.ItemId == p.IgItem3Id).FirstOrDefault();
                    TableItemDetail item4 = allItems.Where(i => i.ItemId == p.IgItem4Id).FirstOrDefault();
                    TableItemDetail item5 = allItems.Where(i => i.ItemId == p.IgItem5Id).FirstOrDefault();
                    TableItemDetail item6 = allItems.Where(i => i.ItemId == p.IgItem6Id).FirstOrDefault();
                    TableItemDetail relic1 = allItems.Where(i => i.ItemId == p.IgRelic1Id).FirstOrDefault();
                    TableItemDetail relic2 = allItems.Where(i => i.ItemId == p.IgRelic2Id).FirstOrDefault();

                    //construct the playerStat
                    PlayerStat player = new PlayerStat
                    {
                        //KDA
                        Kills = p.IgKills,
                        Deaths = p.IgDeaths,
                        Assists = p.IgAssists,
                        //other stats
                        DamageDealt = p.IgDamageDealt,
                        DamageMitigated = p.IgDamageMitigated,
                        DamageTaken = p.IgDamageTaken,
                        DistanceTravelled = p.IgDistanceTraveled,
                        FireGiantsKilled = p.IgFireGiantsKilled,
                        FirstBlood = (bool)p.IgFirstBlood,
                        God = playedGod,
                        GoldEarned = p.IgGoldEarned,
                        GoldFuriesKilled = p.IgGoldFuriesKilled,
                        GPM = p.IgGpm,
                        Healing = p.IgHealing,
                        HighestMultiKill = p.IgHighestMultiKill,
                        IngameTeamID = p.IgTaskforce,
                        MinionDamage = p.IgMinionDamage,
                        WardsPlaced = p.IgWardsPlaced,
                        StructureDamage = p.IgStructureDamage,
                        TimeSpentDeathInSeconds = p.IgTimeSpentDeathInSeconds,
                        TowersDestroyed = p.IgTowersDestroyed,
                        Won = (bool)p.WinStatus,
                        Level = p.IgPlayerLevel,
                        ObjectiveAssists = p.IgObjectiveAssists,
                        Doubles = p.IgDoubles,
                        Triples = p.IgTriples,
                        Quadras = p.IgQuadras,
                        Pentas = p.IgPentas,
                        Region = p.IgRegion,
                        KillingSpree = p.IgKillingSpree,
                        PhoenixesDestroyed = p.IgPhoenixesDestroyed,
                        //items
                        Item1Icon = item1?.ItemIconUrl,
                        Item1ID = item1?.ItemId,
                        Item1Name = item1?.ItemName,
                        Item2Icon = item2?.ItemIconUrl,
                        Item2ID = item2?.ItemId,
                        Item2Name = item2?.ItemName,
                        Item3Icon = item3?.ItemIconUrl,
                        Item3ID = item3?.ItemId,
                        Item3Name = item3?.ItemName,
                        Item4Icon = item4?.ItemIconUrl,
                        Item4ID = item4?.ItemId,
                        Item4Name = item4?.ItemName,
                        Item5Icon = item5?.ItemIconUrl,
                        Item5ID = item5?.ItemId,
                        Item5Name = item5?.ItemName,
                        Item6Icon = item6?.ItemIconUrl,
                        Item6ID = item6?.ItemId,
                        Item6Name = item6?.ItemName,
                        //relics
                        Relic1Icon = relic1?.ItemIconUrl,
                        Relic1ID = relic1?.ItemId,
                        Relic1Name = relic1?.ItemName,
                        Relic2Icon = relic2?.ItemIconUrl,
                        Relic2ID = relic2?.ItemId,
                        Relic2Name = relic2?.ItemName,
                        //Player & Role
                        Player = new Player { PlayerID = p?.PlayerId, Playername = p.PlayerName, Platform = p?.PlayerPlatformId != null ? ((ApiPlatformEnum)p.PlayerPlatformId).ToString() : null },
                        FirstBanSide = p.IgTaskforce == 1, //taskforce 1 is order, order is always the first ban side
                    };

                    listOfPlayerStats.Add(player);
                }

                return listOfPlayerStats;
            }
        #endregion
    }
}
