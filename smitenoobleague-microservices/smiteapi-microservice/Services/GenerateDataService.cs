﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using smiteapi_microservice.Interfaces;
using smiteapi_microservice.Models.External;
using smiteapi_microservice.Models.Internal;
using smiteapi_microservice.Smiteapi_DB;

namespace smiteapi_microservice.Services
{
    public class GenerateDataService : IGenerateDataService
    {
        //services
        private readonly SNL_Smiteapi_DBContext _db;
        private readonly IHirezApiContext _hirezApi;
        private readonly IExternalServices _externalServices;
        //logging
        private readonly ILogger<GenerateDataService> _logger;

        public GenerateDataService(SNL_Smiteapi_DBContext db, IHirezApiContext hirezApi, ILogger<GenerateDataService> logger, IExternalServices externalServices)
        {
            //database
            _db = db;
            //api service
            _hirezApi = hirezApi;
            //logger
            _logger = logger;
            //external services
            _externalServices = externalServices;

        }

        public async Task<ActionResult> GenerateMatchDataForMatchupWithTeamIds(int winningTeamId, int losingTeamId, DateTime? playedDate, bool? faultyQueueID, bool? hiddenPlayersChance, int? numberOfFillsWinners, int? numberOfFillsLosers)
        {
            try
            {
                DateTime yesterday = DateTime.Today.AddDays(-1);
                List<ApiMatchList> rankedMatchesFound = await _hirezApi.GetListOfMatchIdsByQueueID(451, yesterday, "15,20");
                if (rankedMatchesFound != null)
                {
                    if (rankedMatchesFound[0]?.ret_msg != null)
                    {
                        return new ObjectResult(rankedMatchesFound[0]?.ret_msg) { StatusCode = 400 }; //NOT FOUND
                    }
                    else
                    {
                        Random random = new Random();
                        int indexToSelect = random.Next(0, rankedMatchesFound.Count() - 1);
                        int matchIdToUse = (int)rankedMatchesFound[indexToSelect].Match;
                        //Get actual matchdata
                        MatchData matchToChange = await GetMatchDetailsAsync(matchIdToUse);
                        //set patch number
                        matchToChange.patchNumber = (await _hirezApi.GetPatchInfo()).version_string;

                        OptionalMatchManipulation(playedDate, faultyQueueID, hiddenPlayersChance, matchToChange);

                        if (matchToChange.ret_msg != null)
                        {
                            return new ObjectResult("Something went wrong: " + matchToChange.ret_msg.ToString()) { StatusCode = 400 };
                        }

                        MatchData manipulatedMatchData = await ReplaceMatchDataPlayers(matchToChange, numberOfFillsWinners, numberOfFillsLosers, winningTeamId, losingTeamId);

                        return await _externalServices.SaveMatchdataToStatService(manipulatedMatchData);
                    }
                }
                else
                {
                    return new ObjectResult("No ranked matches found to generate data from") { StatusCode = 404 }; //NOT FOUND
                }
            }
            catch(Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to generate matchdata. does the target team have 5 players set?");
                //return result to client
                return new ObjectResult("Something went wrong trying to generate matchdata. does the target team have 5 players set?") { StatusCode = 500 }; //INTERNAL SERVER ERRORr
            }
        }

        public async Task<ActionResult> GenerateMatchDataForInhouseUsingLeagueTeams(int winningTeamId, int losingTeamId, DateTime? playedDate, bool? faultyQueueID, bool? hiddenPlayersChance, int? numberOfFillsWinners, int? numberOfFillsLosers)
        {
            try
            {
                DateTime yesterday = DateTime.Today.AddDays(-1);
                List<ApiMatchList> rankedMatchesFound = await _hirezApi.GetListOfMatchIdsByQueueID(451, yesterday, "15,20");
                if (rankedMatchesFound != null)
                {
                    if (rankedMatchesFound[0]?.ret_msg != null)
                    {
                        return new ObjectResult(rankedMatchesFound[0]?.ret_msg) { StatusCode = 400 }; //NOT FOUND
                    }
                    else
                    {
                        Random random = new Random();
                        int indexToSelect = random.Next(0, rankedMatchesFound.Count() - 1);
                        int matchIdToUse = (int)rankedMatchesFound[indexToSelect].Match;
                        //Get actual matchdata
                        MatchData matchToChange = await GetMatchDetailsAsync(matchIdToUse);
                        //set patch number
                        matchToChange.patchNumber = (await _hirezApi.GetPatchInfo()).version_string;

                        OptionalMatchManipulation(playedDate, faultyQueueID, hiddenPlayersChance, matchToChange);

                        if (matchToChange.ret_msg != null)
                        {
                            return new ObjectResult("Something went wrong: " + matchToChange.ret_msg.ToString()) { StatusCode = 400 };
                        }

                        MatchData manipulatedMatchData = await ReplaceMatchDataPlayers(matchToChange, numberOfFillsWinners, numberOfFillsLosers, winningTeamId, losingTeamId);
                        //the only difference with the other generate. this is a quick lazy solution
                        return await _externalServices.SaveInhouseMatchdataToInhouseService(manipulatedMatchData);
                    }
                }
                else
                {
                    return new ObjectResult("No ranked matches found to generate data from") { StatusCode = 404 }; //NOT FOUND
                }
            }
            catch (Exception ex)
            {
                //log the error
                _logger.LogError(ex, "Something went wrong trying to generate matchdata. does the target team have 5 players set?");
                //return result to client
                return new ObjectResult("Something went wrong trying to generate matchdata. does the target team have 5 players set?") { StatusCode = 500 }; //INTERNAL SERVER ERRORr
            }
        }
        #region methods
        private static void OptionalMatchManipulation(DateTime? playedDate, bool? faultyQueueID, bool? hiddenPlayersChance, MatchData matchToChange)
        {
            var nullDate = new DateTime();
            //set the match entry date
            if (playedDate != nullDate)
            {
                matchToChange.EntryDate = (DateTime)playedDate;
            }


            if (faultyQueueID != null)
            {
                //change gamemodeid so it is valid
                if (!(bool)faultyQueueID)
                {
                    matchToChange.GamemodeID = 429;
                }
            }
            else
            {
                matchToChange.GamemodeID = 429;
            }

            if (hiddenPlayersChance != null)
            {
                //change ret_msg so that there are no hidden players in the match
                if (!(bool)hiddenPlayersChance)
                {
                    if (matchToChange.ret_msg != null)
                    {
                        if (matchToChange.ret_msg.ToString().Contains("Privacy"))
                        {
                            matchToChange.ret_msg = null;
                        }
                    }
                }
            }
            else
            {
                if (matchToChange.ret_msg != null)
                {
                    if (matchToChange.ret_msg.ToString().Contains("Privacy"))
                    {
                        matchToChange.ret_msg = null;
                    }
                }
            }
        }

        private async Task<MatchData> ReplaceMatchDataPlayers(MatchData match, int? numberOfFillsWinners, int? numberOfFillsLosers, int winningTeamId, int losingTeamId)
        {
            //Replace the matchdata with that of the teams that where submitted
            TeamWithDetails winningTeam = await _externalServices.GetTeamWithDetailsByIdAsync(winningTeamId);
            TeamWithDetails losingTeam = await _externalServices.GetTeamWithDetailsByIdAsync(losingTeamId);


            //loop through each 5 member of each team
            for (int memberCount = 0; memberCount < 5; memberCount++)
            {
                //set the number of players ingame that should be replaced, members will be replaced until the threshold is reached.
                if (numberOfFillsWinners != null)
                {
                    if (memberCount < (5 - numberOfFillsWinners))
                    {
                        //winner
                        match.Winners[memberCount].Player.Playername = winningTeam?.TeamMembers?[memberCount]?.TeamMemberName;
                        match.Winners[memberCount].Player.PlayerID = winningTeam?.TeamMembers?[memberCount]?.PlayerID;
                        match.Winners[memberCount].Player.Platform = winningTeam?.TeamMembers?[memberCount]?.TeamMemberPlatform;
                    }
                }
                else
                {
                    //winner
                    match.Winners[memberCount].Player.Playername = winningTeam?.TeamMembers?[memberCount]?.TeamMemberName;
                    match.Winners[memberCount].Player.PlayerID = winningTeam?.TeamMembers?[memberCount]?.PlayerID;
                    match.Winners[memberCount].Player.Platform = winningTeam?.TeamMembers?[memberCount]?.TeamMemberPlatform;
                }

                if (numberOfFillsLosers != null)
                {
                    if (memberCount < (5 - numberOfFillsLosers))
                    {
                        //loser
                        match.Losers[memberCount].Player.Playername = losingTeam?.TeamMembers?[memberCount]?.TeamMemberName;
                        match.Losers[memberCount].Player.PlayerID = losingTeam?.TeamMembers?[memberCount]?.PlayerID;
                        match.Losers[memberCount].Player.Platform = losingTeam?.TeamMembers?[memberCount]?.TeamMemberPlatform;
                    }
                }
                else
                {
                    //loser
                    match.Losers[memberCount].Player.Playername = losingTeam?.TeamMembers?[memberCount]?.TeamMemberName;
                    match.Losers[memberCount].Player.PlayerID = losingTeam?.TeamMembers?[memberCount]?.PlayerID;
                    match.Losers[memberCount].Player.Platform = losingTeam?.TeamMembers?[memberCount]?.TeamMemberPlatform;
                }
            }


            return match;
        }

        private async Task<MatchData> GetMatchDetailsAsync(int MatchID)
        {
            List<ApiPlayerMatchStat> matchDetails = await _hirezApi.GetMatchDetailsByMatchID(MatchID);

            if (matchDetails?[0]?.ret_msg != null && !(bool)matchDetails?[0]?.ret_msg.ToString().Contains("Privacy"))
            {
                if (matchDetails[0].ret_msg.ToString() == "[]")
                {
                    return new MatchData { ret_msg = "No match found with the given ID" };
                }
                else
                {
                    return new MatchData { ret_msg = matchDetails[0].ret_msg };
                }
            }
            else
            {
                if (matchDetails?.Count() > 0)
                {

                    TimeSpan time = TimeSpan.FromSeconds((int)matchDetails[0]?.Match_Duration);
                    var ms = matchDetails[0];


                    MatchData match = new MatchData
                    {
                        GameID = MatchID,
                        MatchDurationInSeconds = (int)ms?.Match_Duration,
                        MatchDuration = $"{time:mm} min {time:ss} sec",
                        EntryDate = (DateTime)ms?.Entry_Datetime,
                        GamemodeID = (int)ms?.match_queue_id,
                        ret_msg = ms?.ret_msg,
                        Winners = new List<PlayerStat>(),
                        Losers = new List<PlayerStat>(),
                        BannedGods = new List<God>(),
                    };
                    List<string> banNames = new List<string> { ms.Ban1, ms.Ban2, ms.Ban3, ms.Ban4, ms.Ban5, ms.Ban6, ms.Ban7, ms.Ban8, ms.Ban9, ms.Ban10 };
                    List<int?> bansIds = new List<int?> { ms.Ban1Id, ms.Ban2Id, ms.Ban3Id, ms.Ban4Id, ms.Ban5Id, ms.Ban6Id, ms.Ban7Id, ms.Ban8Id, ms.Ban9Id, ms.Ban10Id };

                    //if player data is available loop through and put it in the object
                    // if there are less then 10 players available for data something is wrong
                    //if a match isn't available yet this will happen and the return message will contain the date + 7 days for when the match becomes available
                    //should check ret_msg before doing all the rest
                    //should split up in little methods for a clearer view of code
                    if (matchDetails?.Count() == 10)
                    {
                        for (int i = 0; i < 10; i++)
                        {
                            if (banNames[i] != null)
                            {
                                var godname = Regex.Replace(banNames[i]?.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();

                                God ban = new God
                                {
                                    GodId = bansIds[i],
                                    GodName = banNames[i],
                                    GodIcon = "https://web2.hirez.com/smite/god-icons/" + godname + ".jpg"
                                };
                                //add to list of bans
                                match.BannedGods.Add(ban);
                            }
                            else
                            {
                                God ban = new God
                                {
                                    GodId = bansIds[i],
                                    GodName = banNames[i],
                                    GodIcon = null
                                };
                                //add to list of bans
                                match.BannedGods.Add(ban);
                            }
                        }

                        //Fill the winner and loser list
                        foreach (var mp in matchDetails)
                        {
                            //if a player is hidden it will be put in the match's ret_msg
                            if (mp.ret_msg != null)
                            {
                                //check for hidden to make 100% sure
                                if (mp.ret_msg.ToString().Contains("Privacy"))
                                {
                                    if (match.ret_msg != null)
                                    {
                                        if (!match.ret_msg.ToString().Contains("Privacy flag set for one or more players.. Player(s):"))
                                        {
                                            match.ret_msg = "Privacy flag set for one or more players.. Player(s):";
                                            match.ret_msg += " " + mp.hz_player_name + mp.hz_gamer_tag;
                                        }
                                        else
                                        {
                                            //add the player onto the string of players that has privacy flagged toggled on
                                            match.ret_msg += ", " + mp.hz_player_name + mp.hz_gamer_tag;
                                        }
                                    }
                                    else
                                    {
                                        match.ret_msg = "Privacy flag set for one or more players.. Player(s):";
                                        match.ret_msg += " " + mp.hz_player_name + mp.hz_gamer_tag;
                                    }
                                }
                            }
                            else
                            {
                                //make sure to get general match info from one of the players. this is a backup if the first player returned is hidden and can not provide the general info
                                if(match.GamemodeID == null)
                                {
                                    match.GamemodeID = (int)mp.match_queue_id;
                                }

                                if(match.MatchDurationInSeconds == null)
                                {
                                    match.MatchDurationInSeconds = (int)ms?.Match_Duration;
                                }

                                if(match.MatchDuration == null)
                                {
                                    TimeSpan t = TimeSpan.FromSeconds((int)mp.Match_Duration);
                                    match.MatchDuration = $"{t:mm} min {t:ss} sec";
                                }

                                if(match.EntryDate == null)
                                {
                                    match.EntryDate = (DateTime)ms?.Entry_Datetime;
                                }

                            }
                            //make names friendly for image url
                            string relic1 = Regex.Replace(mp.Item_Active_1?.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                            string relic2 = Regex.Replace(mp.Item_Active_2?.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                            string item1 = Regex.Replace(mp.Item_Purch_1?.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                            string item2 = Regex.Replace(mp.Item_Purch_2?.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                            string item3 = Regex.Replace(mp.Item_Purch_3?.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                            string item4 = Regex.Replace(mp.Item_Purch_4?.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                            string item5 = Regex.Replace(mp.Item_Purch_5?.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                            string item6 = Regex.Replace(mp.Item_Purch_6?.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                            string godname = Regex.Replace(mp.Reference_Name?.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();

                            PlayerStat playerStat = new PlayerStat
                            {
                                //General info //gamertag for console - playername for pc, will be empty string when other platform
                                Player = new Player { PlayerID = mp.ActivePlayerId, Playername = mp.hz_player_name + mp.hz_gamer_tag, Platform = mp.playerPortalId.ToString() },
                                IngameTeamID = mp.TaskForce,
                                Won = mp.TaskForce == mp.Winning_TaskForce ? true : false,
                                FirstBanSide = mp.Win_Status == mp.First_Ban_Side ? true : false,
                                God = new God { GodId = mp.GodId, GodName = mp.Reference_Name, GodIcon = "https://web2.hirez.com/smite/god-icons/" + godname + ".jpg" },
                                //DMG
                                DamageDealt = mp.Damage_Player,
                                DamageTaken = mp.Damage_Taken,
                                DamageMitigated = mp.Damage_Mitigated,
                                //KDA
                                Kills = mp.Kills_Player,
                                Deaths = mp.Deaths,
                                Assists = mp.Assists,
                                //General stats
                                Level = mp.Final_Match_Level,
                                GoldEarned = mp.Gold_Earned,
                                GPM = mp.Gold_Per_Minute,
                                Healing = mp.Healing,
                                //Relics
                                Relic1ID = mp.ActiveId1,
                                Relic2ID = mp.ActiveId2,
                                Relic1Icon = relic1 != "" ? "https://web2.hirez.com/smite/item-icons/" + relic1 + ".jpg" : "/images/noimage1.png",
                                Relic2Icon = relic2 != "" ? "https://web2.hirez.com/smite/item-icons/" + relic2 + ".jpg" : "/images/noimage1.png",
                                Relic1Name = mp.Item_Active_1,
                                Relic2Name = mp.Item_Active_2,
                                //Items
                                Item1ID = mp.ItemId1,
                                Item2ID = mp.ItemId2,
                                Item3ID = mp.ItemId3,
                                Item4ID = mp.ItemId4,
                                Item5ID = mp.ItemId5,
                                Item6ID = mp.ItemId6,
                                Item1Icon = item1 != "" ? "https://web2.hirez.com/smite/item-icons/" + item1 + ".jpg" : "/images/noimage1.png",
                                Item2Icon = item2 != "" ? "https://web2.hirez.com/smite/item-icons/" + item2 + ".jpg" : "/images/noimage1.png",
                                Item3Icon = item3 != "" ? "https://web2.hirez.com/smite/item-icons/" + item3 + ".jpg" : "/images/noimage1.png",
                                Item4Icon = item4 != "" ? "https://web2.hirez.com/smite/item-icons/" + item4 + ".jpg" : "/images/noimage1.png",
                                Item5Icon = item5 != "" ? "https://web2.hirez.com/smite/item-icons/" + item5 + ".jpg" : "/images/noimage1.png",
                                Item6Icon = item6 != "" ? "https://web2.hirez.com/smite/item-icons/" + item6 + ".jpg" : "/images/noimage1.png",
                                Item1Name = mp.Item_Purch_1,
                                Item2Name = mp.Item_Purch_2,
                                Item3Name = mp.Item_Purch_3,
                                Item4Name = mp.Item_Purch_4,
                                Item5Name = mp.Item_Purch_5,
                                Item6Name = mp.Item_Purch_6,
                                //Map stats
                                FireGiantsKilled = mp.Kills_Fire_Giant,
                                GoldFuriesKilled = mp.Kills_Gold_Fury,
                                //Extra stats
                                KillingSpree = mp.Killing_Spree,
                                FirstBlood = mp.Kills_First_Blood > 0 ? true : false,
                                TowersDestroyed = mp.Towers_Destroyed,
                                PhoenixesDestroyed = mp.Kills_Phoenix,
                                WardsPlaced = mp.Wards_Placed,
                                StructureDamage = mp.Structure_Damage,
                                MinionDamage = mp.Damage_Bot,
                                DistanceTravelled = mp.Distance_Traveled,
                                Region = mp.Region,
                                HighestMultiKill = mp.Multi_kill_Max,
                                TimeSpentDeathInSeconds = mp.Time_Dead_Seconds,
                                ObjectiveAssists = mp.Objective_Assists,
                                Doubles = mp.Kills_Double,
                                Pentas = mp.Kills_Penta,
                                Quadras = mp.Kills_Quadra,
                                Triples = mp.Kills_Triple


                            };

                            if (mp.TaskForce == mp.Winning_TaskForce) { match.Winners.Add(playerStat); } else { match.Losers.Add(playerStat); }
                        }
                    }
                    else
                    {
                        if (match.ret_msg == null)
                        {
                            match.ret_msg = "Not all playerdata is available for this match because 1 of the players has their profile hidden.";
                        }
                    }
                    //Return match when there is data available
                    return match;
                }
                else
                {
                    return new MatchData { ret_msg = "No match found with the given ID" };
                }
            }
        }
        #endregion
    }
}
