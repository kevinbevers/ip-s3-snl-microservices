using smiteapi_microservice.Models.Internal;
using smiteapi_microservice.Interfaces;
using smiteapi_microservice.Models.External;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;

namespace smiteapi_microservice.Services
{
    public class HirezApiService : IHirezApiService
    {
        private readonly IHirezApiContext _hirezApi;

        public HirezApiService(IHirezApiContext hirezApi)
        {
            _hirezApi = hirezApi;
        }
        public async Task<ApiPatchInfo> GetCurrentPatchInfoAsync()
        {
            ApiPatchInfo patchInfo = await _hirezApi.GetPatchInfo();

            return patchInfo;
        }

        public async Task<IEnumerable<ApiGod>> GetGodsAsync()
        {
            var allGodData = await _hirezApi.GetAllGods();
            allGodData.ForEach(x => x.GodCardDecent_Url = new Uri($"https://webcdn.hirezstudios.com/smite/god-skins/{x.Name.ToLower().Replace(' ','_')}_standard-{x.Name.ToLower().Replace(' ','-')}.jpg"));
            return allGodData;
        }

        public async Task<IEnumerable<ApiItem>> GetItemsAsync()
        {
            return await _hirezApi.GetAllItems();
        }

        public async Task<MatchData> GetMatchDetailsAsync(int MatchID)
        {
            try
            {
                //var pong = await _hirezApi.PingAPI();
                //if (pong != null || pong != "")
                //{
                List<ApiPlayerMatchStat> matchDetails = await _hirezApi.GetMatchDetailsByMatchID(MatchID);

                if (matchDetails?[0]?.ret_msg != null && !(bool)matchDetails?[0]?.ret_msg.ToString().Contains("Privacy"))
                {
                    if (matchDetails[0].ret_msg.ToString() == "[]")
                    {
                        return new MatchData { ret_msg = "No match found with the given ID" };
                    }
                    else
                    {
                        return new MatchData { ret_msg = matchDetails[0]?.ret_msg, EntryDate = (DateTime)(matchDetails[0]?.Entry_Datetime) };
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
                                        GodIcon = "https://webcdn.hirezstudios.com/smite/god-icons/" + godname + ".jpg"
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
                                            if (!match.ret_msg.ToString().Contains("Privacy flag set for player(s):"))
                                            {
                                                match.ret_msg = "Privacy flag set for player(s):";
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
                                            match.ret_msg = "Privacy flag set for player(s):";
                                            match.ret_msg += " " + mp.hz_player_name + mp.hz_gamer_tag;
                                        }
                                    }
                                }
                                else
                                {
                                    //make sure to get general match info from one of the players. this is a backup if the first player returned is hidden and can not provide the general info
                                    if (match.GamemodeID == null)
                                    {
                                        match.GamemodeID = (int)mp.match_queue_id;
                                    }

                                    if (match.MatchDurationInSeconds == null)
                                    {
                                        match.MatchDurationInSeconds = (int)ms?.Match_Duration;
                                    }

                                    if (match.MatchDuration == null)
                                    {
                                        TimeSpan t = TimeSpan.FromSeconds((int)mp.Match_Duration);
                                        match.MatchDuration = $"{t:mm} min {t:ss} sec";
                                    }

                                    if (match.EntryDate == null)
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
                                    Player = new Player { PlayerID = mp?.ActivePlayerId == 0 ? null : mp?.ActivePlayerId, Playername = (string)(mp.hz_player_name != null ? mp.hz_player_name : mp.hz_gamer_tag), Platform = mp?.playerPortalId.ToString() },
                                    IngameTeamID = mp.TaskForce,
                                    Won = mp.TaskForce == mp.Winning_TaskForce ? true : false,
                                    FirstBanSide = mp.Win_Status == mp.First_Ban_Side ? true : false,
                                    God = new God { GodId = mp.GodId, GodName = mp.Reference_Name, GodIcon = "https://webcdn.hirezstudios.com/smite/god-icons/" + godname + ".jpg" },
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
                                    Relic1Icon = relic1 != "" ? "https://webcdn.hirezstudios.com/smite/item-icons/" + relic1 + ".jpg" : "/images/noimage1.png",
                                    Relic2Icon = relic2 != "" ? "https://webcdn.hirezstudios.com/smite/item-icons/" + relic2 + ".jpg" : "/images/noimage1.png",
                                    Relic1Name = mp.Item_Active_1,
                                    Relic2Name = mp.Item_Active_2,
                                    //Items
                                    Item1ID = mp.ItemId1,
                                    Item2ID = mp.ItemId2,
                                    Item3ID = mp.ItemId3,
                                    Item4ID = mp.ItemId4,
                                    Item5ID = mp.ItemId5,
                                    Item6ID = mp.ItemId6,
                                    Item1Icon = item1 != "" ? "https://webcdn.hirezstudios.com/smite/item-icons/" + item1 + ".jpg" : "/images/noimage1.png",
                                    Item2Icon = item2 != "" ? "https://webcdn.hirezstudios.com/smite/item-icons/" + item2 + ".jpg" : "/images/noimage1.png",
                                    Item3Icon = item3 != "" ? "https://webcdn.hirezstudios.com/smite/item-icons/" + item3 + ".jpg" : "/images/noimage1.png",
                                    Item4Icon = item4 != "" ? "https://webcdn.hirezstudios.com/smite/item-icons/" + item4 + ".jpg" : "/images/noimage1.png",
                                    Item5Icon = item5 != "" ? "https://webcdn.hirezstudios.com/smite/item-icons/" + item5 + ".jpg" : "/images/noimage1.png",
                                    Item6Icon = item6 != "" ? "https://webcdn.hirezstudios.com/smite/item-icons/" + item6 + ".jpg" : "/images/noimage1.png",
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
                //}
                //else
                //{
                //    return new MatchData { ret_msg = "pinging smite api failed" };
                //}
            }
            catch(Exception ex)
            {
                return new MatchData() {ret_msg = ex };
            }
        }

        public async Task<ActionResult<IEnumerable<Player>>> SearchPlayersByNameAsync(string name)
        {
            List<ApiPlayer> playersfound = await _hirezApi.SearchPlayerByName(name);

            List<Player> returnList = new List<Player>();
            //convert ApiPlayer model to Player model
            if (playersfound?[0].ret_msg != null)
            {
                if(playersfound?[0].ret_msg.ToString() == "[]")
                {
                    return new ObjectResult(returnList) { StatusCode = 200 };
                }
                //could return message to user
                return new ObjectResult(playersfound?[0].ret_msg.ToString()) { StatusCode = 404 };
            }
            else
            {
                playersfound.ForEach(p => returnList.Add(new Player { Playername = p.Name, Platform = p.portal_id.ToString(), PlayerID = p.player_id }));
            }

            return new ObjectResult(returnList) {StatusCode = 200 };
        }
    }
}
