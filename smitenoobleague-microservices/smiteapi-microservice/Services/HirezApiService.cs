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
                    ret_msg = matchDetails[0]?.ret_msg
                };

                return match;
            }
            else
            {
                return new Match();
            }

        }

        public Task<int?> UpdateGodsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<int?> UpdateItemsAsync()
        {
            throw new NotImplementedException();
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
