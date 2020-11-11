using smiteapi_microservice.Internal_Models;
using smiteapi_microservice.Interfaces;
using smiteapi_microservice.External_Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;

namespace smiteapi_microservice.Services
{
    public class HirezApiService : IHirezApiService
    {
        private readonly IHirezApiContext _hirezApi;

        public HirezApiService(IHirezApiContext hirezApi)
        {
            _hirezApi = hirezApi;
        }
        public async Task<string> GetCurrentPatchInfoAsync()
        {
            ApiPatchInfo patchInfo = await _hirezApi.GetPatchInfo();

            return patchInfo.version_string;
        }

        public async Task<IEnumerable<ApiGod>> GetGodsAsync()
        {
            List<ApiGod> gods = await _hirezApi.GetAllGods();

            return gods;
        }

        public async Task<IEnumerable<ApiItem>> GetItemsAsync()
        {
            return await _hirezApi.GetAllItems();
        }

        public async Task<MatchData> GetMatchDetailsAsync(int MatchID)
        {
            //var pong = await _hirezApi.PingAPI();
            //if (pong != null || pong != "")
            //{
                List<ApiPlayerMatchStat> matchDetails = await _hirezApi.GetMatchDetailsByMatchID(MatchID);

                TimeSpan time = TimeSpan.FromSeconds((int)matchDetails[0]?.Match_Duration);
                var ms = matchDetails[0];


                MatchData match = new MatchData
                {
                    GameID = MatchID,
                    MatchDurationInSeconds = (int)ms?.Match_Duration,
                    MatchDuration = $"{time:mm} min {time:ss} sec",
                    EntryDate = (DateTime)ms?.Entry_Datetime,
                    GamemodeID = (int)ms?.match_queue_id,
                    ret_msg = ms?.ret_msg + " ",
                    Winners = new List<MatchData.PlayerStat>(),
                    Losers = new List<MatchData.PlayerStat>(),
                    BannedGods = new List<God>(),
                };
                List<string> banNames = new List<string> { ms.Ban1, ms.Ban2, ms.Ban3, ms.Ban4, ms.Ban5, ms.Ban6, ms.Ban7, ms.Ban8, ms.Ban9, ms.Ban10 };
                List<int> bansIds = new List<int> { ms.Ban1Id, ms.Ban2Id, ms.Ban3Id, ms.Ban4Id, ms.Ban5Id, ms.Ban6Id, ms.Ban7Id, ms.Ban8Id, ms.Ban9Id, ms.Ban10Id };

                for (int i = 0; i < 9; i++)
                {
                    var godname = Regex.Replace(banNames[i].Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                    God ban = new God
                    {
                        GodId = bansIds[i],
                        GodName = banNames[i],
                        GodIcon = "https://web2.hirez.com/smite/god-icons/" + godname + ".jpg"
                    };

                    match.BannedGods.Add(ban);
                }


                if (matchDetails.Count() > 9)
                {
                    //Fill the winner and loser list
                    foreach (var mp in matchDetails)
                    {
                        //make names friendly for image url
                        var relic1 = Regex.Replace(mp.Item_Active_1.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                        var relic2 = Regex.Replace(mp.Item_Active_2.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                        var item1 = Regex.Replace(mp.Item_Purch_1.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                        var item2 = Regex.Replace(mp.Item_Purch_2.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                        var item3 = Regex.Replace(mp.Item_Purch_3.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                        var item4 = Regex.Replace(mp.Item_Purch_4.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                        var item5 = Regex.Replace(mp.Item_Purch_5.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                        var item6 = Regex.Replace(mp.Item_Purch_6.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();
                        var godname = Regex.Replace(mp.Reference_Name.Replace("'", ""), @"[^A-Za-z0-9_\.~]+", "-").ToLower();

                        MatchData.PlayerStat playerStat = new MatchData.PlayerStat
                        {
                            //General info //gamertag for console - playername for pc, will be empty string when other platform
                            player = new Player { PlayerID = mp.ActivePlayerId, Playername = mp.hz_player_name + mp.hz_gamer_tag, Platform = mp.playerPortalId.ToString() },
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

                            //Map stats
                            FireGiantsKilled = mp.Kills_Fire_Giant,
                            GoldFuriesKilled = mp.Kills_Gold_Fury,
                            //Extra stats
                            FirstBlood = mp.Kills_First_Blood > 0 ? true : false,
                            TowersDestroyed = mp.Towers_Destroyed,
                            WardsPlaced = mp.Wards_Placed,
                            StructureDamage = mp.Structure_Damage,
                            MinionDamage = mp.Damage_Bot,
                            DistanceTravelled = mp.Distance_Traveled,
                            Region = mp.Region
                        };

                        if (mp.TaskForce == mp.Winning_TaskForce) { match.Winners.Add(playerStat); } else { match.Losers.Add(playerStat); }
                    }
                }
                //Return match when there is data available
                return match;
            //}
            //else
            //{
            //    return new MatchData { ret_msg = "pinging smite api failed" };
            //}
        }

        public async Task<IEnumerable<Player>> SearchPlayersByNameAsync(string name)
        {
            List<ApiPlayer> playersfound = (List<ApiPlayer>)await _hirezApi.SearchPlayerByName(name);

            List<Player> returnList = new List<Player>();
            //convert ApiPlayer model to Player model
            playersfound.ForEach(p => returnList.Add(new Player { Playername = p.Name, Platform = p.portal_id.ToString(), PlayerID = p.player_id }));

            return returnList;
        }
    }
}
