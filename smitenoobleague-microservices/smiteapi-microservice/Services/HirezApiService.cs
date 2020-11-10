using smiteapi_microservice.Internal_Models;
using smiteapi_microservice.Interfaces;
using smiteapi_microservice.External_Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using System.Net;

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
            //List<ApiGod> gods = (List<ApiGod>)await _hirezApi.GetAllGods();

            return await _hirezApi.GetAllGods();
        }

        public Task<IEnumerable<ApiItem>> GetItemsAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<Match> GetMatchDetailsAsync(int MatchID)
        {
            List<ApiPlayerMatchStat> matchDetails = (List<ApiPlayerMatchStat>)await _hirezApi.GetMatchDetailsByMatchID(MatchID);

            if (matchDetails.Count() > 0)
            {

                TimeSpan time = TimeSpan.FromSeconds((int)matchDetails[0]?.Match_Duration);


                Match match = new Match
                {
                    GameID = MatchID,
                    MatchDurationInSeconds = (int)matchDetails[0]?.Match_Duration,
                    MatchDuration = time.ToString(@"mm\:ss"),
                    EntryDate = (DateTime)matchDetails[0]?.Entry_Datetime,
                    GamemodeID = (int)matchDetails[0]?.match_queue_id,
                    ret_msg = matchDetails[0]?.ret_msg + " Win status: " + matchDetails[0]?.Win_Status,
                    Winners = new List<Match.PlayerStat>(),
                    Losers = new List<Match.PlayerStat>(),
                };

                //Fill the winner and loser list
                foreach(var mp in matchDetails)
                {
                    Match.PlayerStat playerStat = new Match.PlayerStat
                    {
                        //General info //gamertag for console - playername for pc, will be empty string when other platform
                        player = new Player { PlayerID = mp.ActivePlayerId, Playername = mp.hz_player_name + mp.hz_gamer_tag, Platform = mp.playerPortalId },
                        IngameTeamID = mp.TaskForce,
                        Won = true,
                        FirstBanSide = mp.Win_Status == mp.First_Ban_Side ? true : false,
                        God = new God {GodId = mp.GodId, GodName = mp.Reference_Name, GodIcon = "https://web2.hirez.com/smite/god-icons/" + mp.Reference_Name.ToLower() + ".jpg" } ,
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
                        //Items
                        Item1ID = mp.ItemId1,
                        Item2ID = mp.ItemId2,
                        Item3ID = mp.ItemId3,
                        Item4ID = mp.ItemId4,
                        Item5ID = mp.ItemId5,
                        Item6ID = mp.ItemId6,
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
                //Return match when there is data available
                return match;
            }
            else
            {
                //return an empty match with info when no data is available
                return new Match {GameID = MatchID, ret_msg = "no match found by hirez api"};
            }

        }

        public async Task<IEnumerable<Player>> SearchPlayersByNameAsync(string name)
        {
            List<ApiPlayer> playersfound = (List<ApiPlayer>)await _hirezApi.SearchPlayerByName(name);

            List <Player> returnList = new List<Player>();
            //convert ApiPlayer model to Player model
            playersfound.ForEach(p => returnList.Add(new Player { Playername = p.Name, Platform = p.portal_id.ToString(), PlayerID = p.player_id }));

            return returnList;
        }
    }
}
